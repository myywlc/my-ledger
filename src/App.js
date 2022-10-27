import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import './App.css';
import { useEffect, useState } from 'react';


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const {
      name,
      alipay,
      gjj,
      nh,
      zs,
      hz,
      total,
      alipayFormerDiff,
      gjjFormerDiff,
      nhFormerDiff,
      zsFormerDiff,
      hzFormerDiff,
      totalFormerDiff,
    } = payload[0].payload;

    return (
      <div className="custom-tooltip">
        <h4 className="name">{name}</h4>
        <p className="label" style={{ color: '#413ea0' }}>
          {`支付宝: ${alipay}${alipayFormerDiff ? ', 增量: ' + alipayFormerDiff : ''}`}
        </p>
        <p className="label" style={{ color: '#ffc97b' }}>
          {`公积金: ${gjj}${gjjFormerDiff ? ', 增量: ' + gjjFormerDiff : ''}`}
        </p>
        <p className="label" style={{ color: '#82ca9d' }}>
          {`农行: ${nh}${nhFormerDiff ? ', 增量: ' + nhFormerDiff : ''}`}
        </p>
        <p className="label" style={{ color: '#22b9ca' }}>
          {`招商: ${zs}${zsFormerDiff ? ', 增量: ' + zsFormerDiff : ''}`}
        </p>
        <p className="label" style={{ color: '#f30cd4' }}>
          {`杭州: ${hz}${hzFormerDiff ? ', 增量: ' + hzFormerDiff : ''}`}
        </p>
        <p className="label" style={{ color: '#ff7300' }}>
          {`总计: ${total}${totalFormerDiff ? ', 增量: ' + totalFormerDiff : ''}`}
        </p>
      </div>
    );
  }

  return null;
};

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    document.getElementById('file_up').addEventListener('click', function() {
      const reader = new FileReader();
      reader.addEventListener('load', function() {
        if (this.result) {
          setData(JSON.parse(this.result));
        }
      });
      reader.readAsText(document.querySelector('input').files[0]);
    });
  }, []);

  const parseData = (initData) => {
    return initData.map((item, index) => {
      const { alipay, gjj, nh, zs, hz } = item;
      const total = alipay + gjj + nh + zs + hz;
      if (index > 0) {
        const {
          alipay: alipayFormer,
          gjj: gjjFormer,
          nh: nhFormer,
          zs: zsFormer,
          hz: hzFormer,
        } = initData[index - 1];
        const totalFormer = alipayFormer + gjjFormer + nhFormer + zsFormer + hzFormer;
        return {
          ...item,
          total,
          alipayFormerDiff: alipay - alipayFormer,
          gjjFormerDiff: gjj - gjjFormer,
          nhFormerDiff: nh - nhFormer,
          zsFormerDiff: zs - zsFormer,
          hzFormerDiff: hz - hzFormer,
          totalFormerDiff: total - totalFormer,
        };
      } else {
        return { ...item, total };
      }
    });
  };

  return (
    <div className="App">
      <h3>lin ledger</h3>
      {
        data ? (
          <ComposedChart
            width={1400}
            height={750}
            data={parseData(data)}
            margin={{
              top: 0,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="alipay" barSize={20} fill="#413ea0" name={'支付宝'} />
            <Bar dataKey="gjj" barSize={20} fill="#ffc97b" name={'公积金'} />
            <Bar dataKey="nh" barSize={20} fill="#82ca9d" name={'农行'} />
            <Bar dataKey="zs" barSize={20} fill="#22b9ca" name={'招商'} />
            <Bar dataKey="hz" barSize={20} fill="#f30cd4" name={'杭州'} />
            <Line type="monotone" dataKey="total" stroke="#ff7300" name={'总计'} />
          </ComposedChart>
        ) : (
          <>
            <input
              accept="text/json"
              type="file"
            />
            <button id="file_up">生成图表</button>
          </>
        )
      }
    </div>
  );
}

export default App;

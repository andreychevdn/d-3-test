import { PureComponent } from 'react';
import {ComposedChart ,Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {firstLineData, secondLineData, arrows } from '../data/data.js';

const mergedData = firstLineData.map(item => {
  const matchedData = secondLineData.find(({ date }) => date === item.date)

  return {
    date: item.date,
    line1: item.value,
    line2: matchedData.value
  };
});

const maxValueYAxis = 3000;

const allCombinedData = mergedData.map(item => {
  const newItem = {...item};
  
  arrows.forEach((arrow) => {
    if (newItem.date >= arrow['min_period_id'] && newItem.date <= arrow['max_period_id']) {
            
      if (arrow['type_of_rho'] === 'direct') {
        newItem.red = maxValueYAxis;
      } else if (arrow['type_of_rho'] === 'reverse') {
        newItem.green = maxValueYAxis;
      }
    }
  })
  return newItem;
})

export default class Chart extends PureComponent {

  state = {
    opacity: {
        line1: 1,
        line2: 1,
    },
  };

  handleMouseEnter = (o) => {
    const { dataKey } = o;
    const { opacity } = this.state;

    this.setState({
      opacity: { ...opacity, [dataKey]: 0.5 },
    });
  };

  handleMouseLeave = (o) => {
    const { dataKey } = o;
    const { opacity } = this.state;

    this.setState({
      opacity: { ...opacity, [dataKey]: 1 },
    });
  };

  render() {
    const { opacity } = this.state;

    return (
      <div style={{ width: '100%' }}>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            width={500}
            height={300}
            data={allCombinedData}
            margin={{
              top: 25,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
            <Line type="monotone" dataKey="line1" strokeOpacity={opacity.line1} stroke="#0000FF" activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="line2" strokeOpacity={opacity.line2} stroke="#808080" activeDot={{ r: 4 }}/>
            <Area type="monotone" dataKey="red" fill="#FF6550" stroke="#FF6550" />
            <Area type="monotone" dataKey="green" fill="#00FF50" stroke="#00FF50" />
           </ComposedChart>
          </ResponsiveContainer>
      </div>
    );
  }
}

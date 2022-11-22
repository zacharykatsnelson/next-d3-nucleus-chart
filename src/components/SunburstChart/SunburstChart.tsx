import React, { useEffect, RefObject } from 'react';
import { Text, Wrapper } from './SunburstChart.css';
import * as d3 from 'd3';
import { getColor, getTextTransform, partition } from './SunburstChartHelpers';
import data from '../../../public/data/data.json';
import { Types } from './types';

export const SunburstChart = (props: ISunburstChartProps) => {
  const [viewBox, setViewBox] = React.useState('0,0,0,0');
  const ref: RefObject<SVGSVGElement> = React.createRef();
  const RADIUS = props.size / 2;
  const format = d3.format(',d');

  const arc = d3
    .arc<d3.HierarchyRectangularNode<Types.Data>>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.015))
    .padRadius(RADIUS / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - 3);

  const getAutoBox = () => {
    if (!ref.current) {
      return '';
    }
    const { x, y, width, height } = ref.current.getBBox();
    return [x, y, width, height].toString();
  };

  useEffect(() => {
    setViewBox(getAutoBox());
  });

  const root = partition(data, RADIUS);

  return (
    <Wrapper>
      <svg width={props.size} height={props.size} viewBox={viewBox} ref={ref}>
        <g fillOpacity={0.8}>
          {root
            .descendants()
            .filter((d) => d.depth)
            .map((d, i) => (
              // @ts-ignore
              <path key={`${d.data.name}-${i}`} fill={getColor(d)} d={arc(d)}>
                <text>
                  {d
                    .ancestors()
                    .map((d) => d.data.name)
                    .reverse()
                    .join('/')}
                  \n${format(d.value)}
                </text>
              </path>
            ))}
        </g>
        <g textAnchor="middle">
          {root
            .descendants()
            .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
            .map((d, i) => (
              <Text
                key={`${d.data.name}-${i}`}
                transform={getTextTransform(d)}
                dy="0.35em"
              >
                {d.data.name}
              </Text>
            ))}
        </g>
      </svg>
    </Wrapper>
  );
};

interface ISunburstChartProps {
  size: number;
}

export default ISunburstChartProps;

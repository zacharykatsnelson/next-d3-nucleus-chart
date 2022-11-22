import * as d3 from 'd3';
import { Types } from './types';
import data from '../../../public/data/data.json';

export const partition = (data: any, radius: number) =>
  d3.partition<Types.Data>().size([2 * Math.PI, radius])(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

const color = d3.scaleOrdinal(
  d3.quantize(d3.interpolateRainbow, data.children.length + 1)
);

export const getTextTransform = (
  d: d3.HierarchyRectangularNode<Types.Data>
) => {
  const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
  const y = (d.y0 + d.y1) / 2;
  return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
};

export const getColor = (d: d3.HierarchyRectangularNode<Types.Data>) => {
  // @ts-ignore
  while (d.depth > 1) d = d.parent;
  return color(d.data.name);
};

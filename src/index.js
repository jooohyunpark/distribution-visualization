import './style.scss'
import * as d3 from 'd3'
import _data from './data/data.json'

const X = 'pl_radj'

// data
////////////////////////////////////////////////
console.log('original data size: ', _data.length)

let data = _data.filter(el => {
  return (
    (el.pl_name && el.st_dist && el.pl_orbper && el.pl_radj && el.pl_bmassj) !==
    null
  )
})

// data = data.filter(d => d.pl_radj < 1)

console.log('computed data length: ', data.length)

const max_distance = max('st_dist')
const min_distance = min('st_dist')
const max_radius = max('pl_radj')
const min_radius = min('pl_radj')
const max_mass = max('pl_bmassj')
const min_mass = min('pl_bmassj')

// let test = data.filter(d => {
//   return d.pl_radj > 2
// })
// console.log(test.length)

////////////////////////////////////////////////

let { width, height } = document
  .querySelector('.container')
  .getBoundingClientRect()

const margin = {
  top: 100,
  bottom: 100,
  right: 100,
  left: 100
}

let svg = d3
  .select('.container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

let _width = +svg.attr('width') - margin.left - margin.right,
  _height = +svg.attr('height') - margin.top - margin.bottom

const init = () => {
  let xScale = d3
    .scaleLinear()
    .range([0, _width])
    .domain(
      d3.extent(data, function(d) {
        // return d.pl_radj + d.pl_bmassj
        return d[X]
      })
    )

  svg
    .append('rect')
    .attr('width', _width)
    .attr('height', _height)

  let g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('id', function(d) {
      return d.pl_name
    })
    .attr('cx', function(d) {
      // return xScale(d.pl_radj + d.pl_bmassj)
      return xScale(d[X])
    })
    .attr('cy', function(d) {
      return _height * Math.random()
    })
    .attr('r', 3)
    .style('fill', 'nonen')
    .style('stroke', '#fff')
    .style('stroke-width', 1)
}

init()

function min(val) {
  const min = d3.min(data, function(d) {
    return d[val]
  })
  console.log(`min ${val}: `, min)
  return min
}

function max(val) {
  const min = d3.max(data, function(d) {
    return d[val]
  })
  console.log(`max ${val}: `, min)
  return min
}

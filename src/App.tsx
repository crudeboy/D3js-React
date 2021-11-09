import React, { useRef, useEffect, useState } from 'react'
import { select, selectAll, Selection } from 'd3-selection'
import { scaleLinear, scaleBand } from "d3-scale"
import { max } from "d3-array"
import { axisLeft, axisBottom} from 'd3-axis'
import  randomstring  from "randomstring"


const data = [
  {
    name: 'boo',
    number: 10
  },
  {
    name: 'too',
    number: 67
  },
  {
    name: 'roo',
    number: 81
  },
  {
    name: 'hoo',
    number: 38
  },
  {
    name: 'koo',
    number: 28
  },
  {
    name: 'loo',
    number: 59
  },
  {
    name: 'poo',
    number: 59
  },
  {
    name: 'lloo',
    number: 59
  },
  {
    name: 'lkoo',
    number: 59
  },
  {
    name: 'lpoo',
    number: 59
  },
]

const dimensions = {
  width: 800,
  height: 500,
  chartWidth: 800,
  chartHeight: 400,
  marginLeft: 50,
  marginTop: 50
}

const App: React.FC = () => {
  const ref = useRef<SVGSVGElement | null>(null)
  const [selection, setSelection] = useState<null | Selection<SVGSVGElement | null, unknown, null, undefined>>(null)
  const [datas, setDatas] = useState(data)

  let y = scaleLinear()
          .domain([0, max(datas, d=>d.number)!])
          .range([dimensions.height, 0])

  let x = scaleBand()
          .domain(datas.map(d=>d.name))
          .range([0, dimensions.width])
          .paddingInner(0.25)

  useEffect(() => {
    if(!selection){
      setSelection(select (ref.current))
    }else{
      selection 
        .selectAll('rect')
        .data(datas)
        .enter()
        .append('rect')
        .attr('width', x.bandwidth )
        .attr('height', d=> dimensions.height - y(d.number))
        .attr('x', d=>x(d.name)!)
        .attr('y', d=>y(d.number)!)
        .attr('fill', 'cyan')
    }
  }, [selection])

  useEffect(() => {
    if(selection){
      // console.log(selection);
      y = scaleLinear()
          .domain([0, max(datas, d=>d.number)!])
          .range([dimensions.height, 0])
      console.log(datas, "in the use effect");
      x = scaleBand()
          .domain(datas.map(d=>d.name))
          .range([0, dimensions.width])
          .paddingInner(0.25)



      const rects = selection.selectAll('rect').data(datas)

      rects
        .exit()
        .remove()

      rects
        .attr('width', x.bandwidth )
        .attr('height', d=> dimensions.height - y(d.number))
        .attr('x', d=>x(d.name)!)
        .attr('y', d=>y(d.number)!)
        .attr('fill', 'cyan')

      rects
        .enter()
        .append('rect')
        .attr('width', x.bandwidth  )
        .attr('height', d=> dimensions.height - y(d.number))
        .attr('x', d=>x(d.name)!)
        .attr('y', d=>y(d.number)!)
        .attr('fill', 'cyan')

    }
  }, [datas])

  const addRandom = () => {
    const dataTobeAdded = {
      // name: randomstring.generate(10),
      name: `clay-${datas.length}`, ///you need to understand how much opf a stress this same name and need of name difference put me through yesterdayu and today 08-09/11/21
      number: Math.floor(Math.random() * (80) + 20) 
    }
    console.log(datas, "b4");
    console.log([ dataTobeAdded, ...datas]);
    setDatas([...datas, dataTobeAdded])
    console.log(datas, "after");
  }

  const removeLast = () => {
      if(data.length === 0){
        return
      }
      setDatas(datas.slice(0, datas.length - 1))
  }



  return (
    <div>
        <svg  ref={ref} width={dimensions.width} height={dimensions.height} />
        <button onClick={addRandom}>Add Random</button>
        <button onClick={removeLast}>Remove Last Bar</button>
    </div>
  )
}

export default App

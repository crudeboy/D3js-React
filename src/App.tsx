import React, { useRef, useEffect, useState } from 'react'
import { select, selectAll, Selection } from 'd3-selection'
import { scaleLinear, scaleBand } from "d3-scale"
import { max } from "d3-array"
import { axisLeft, axisBottom} from 'd3-axis'
import  randomstring  from "randomstring"
import 'd3-transition'
import { easeElastic, easeQuadInOut, easeBounce, easeLinear } from 'd3-ease'


const data = [
  {
    name: 'boo',
    number: 90
  },
  {
    name: 'too',
    number: 167
  },
  {
    name: 'roo',
    number: 81
  },
  {
    name: 'hoo',
    number: 88
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
    number: 79
  },
  {
    name: 'lloo',
    number: 89
  },
  {
    name: 'lkoo',
    number: 209
  },
  {
    name: 'lpoo',
    number: 223
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
        .attr('fill', 'cyan')
        .attr('x', d=>x(d.name)!)
        .attr('y', dimensions.height)
        .attr('width', x.bandwidth ) 
        .attr('height', 0)
        .transition()
        .duration(500)
        .ease(easeElastic)
        .delay((_,i) =>i*10)
        .attr('height', d=> dimensions.height - y(d.number))
        .attr('y', d=>y(d.number))
        
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
        // .attr("height", dimensions.height)
        // .attr('y', dimensions.height)
        .transition()
        .duration(200)
        .delay(500)

        .attr("height", 0)
        .attr('y', dimensions.height)
        .remove()

      rects //rectangles that are in the DOm previously
        .transition()
        .duration(300)
        .attr('width', x.bandwidth )
        .attr('height', d=> dimensions.height - y(d.number))
        .attr('x', d=>x(d.name)!)
        .attr('y', d=>y(d.number)!)
        .attr('fill', 'cyan')

      rects //rectangles that were just added to tha DOM
        .enter()
        .append('rect')
        .attr('width', x.bandwidth  )
        .attr('height', 0)
        .attr('x', d=>x(d.name)!)
        .attr('y', dimensions.height)
        .attr('fill', 'cyan')
        .transition()
        .duration(500)
        .ease(easeElastic)
        .delay(200)
        .attr('y', d=>y(d.number)!)
        .attr('height', d=> dimensions.height - y(d.number))

    }
  }, [datas])

  const addRandom = () => {
    const dataTobeAdded = {
      // name: randomstring.generate(10),
      name: `clay-${datas.length}`, ///you need to understand how much opf a stress this same name and need of name difference put me through yesterdayu and today 08-09/11/21
      number: Math.floor(Math.random() * (Math.max(...datas.map((a) => a.number))-Math.min(...datas.map((a) => a.number))) + 20) 
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

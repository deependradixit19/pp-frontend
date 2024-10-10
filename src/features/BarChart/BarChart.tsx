import { FC, useEffect } from 'react'
import './_bar-chart.scss'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

interface Props {
  chartData: {
    x: string
    y: number
    date?: string
  }[]
  options?: {}
  datasetOptions?: {
    [key: string]: any
  }
}

const tooltipTimeouts: {
  timeoutKey: string
  timeout: ReturnType<typeof setTimeout>
}[] = []
const clearToooltipTimeouts: (timeoutId?: string) => void = timeoutId => {
  for (let i = 0; i < tooltipTimeouts.length; i++) {
    if (timeoutId) {
      if (timeoutId === tooltipTimeouts[i].timeoutKey) {
        clearTimeout(tooltipTimeouts[i].timeout)
      }
    } else {
      clearTimeout(tooltipTimeouts[i].timeout)
    }
  }
}

const defaultTooltipDataTransform = (x: number, y: number) => ({
  x: x,
  y: `$${y}`
})

export const defaultChartOptions = (
  tooltipDataTransform: (
    x: number,
    y: number
  ) => { x: string | number; y: string | number } = defaultTooltipDataTransform
) =>
  Object.freeze({
    responsive: true,
    scales: {
      y: {
        align: 'start',
        ticks: {
          callback: function (value: any, index: any, ticks: any) {
            return value > 0 ? '$' + value : value
          },
          autoSkip: true,
          maxTicksLimit: 3,
          color: '#9B9B9B',
          font: {
            family: 'sans-serif',
            size: 14
          }
        }
      },
      x: {
        ticks: {
          color: '#9B9B9B',
          font: {
            family: 'sans-serif',
            size: 14
          }
        }
      }
    },
    plugins: {
      tooltip: {
        // yAlign: 'bottom',
        // backgroundColor: 'rgba(38, 42, 51, .7)',
        // displayColors: false,
        // bodyFont: {
        //   family: "sans-serif",
        //   size: 14
        // },
        // callbacks: {
        //   title: function() {
        //     return ''
        //   },
        //   label: function(context:any) {

        //     const date = context.dataset.data[context.dataIndex].date || ""
        //     const value = `$${context.dataset.data[context.dataIndex].y}`
        //     const span = document.createElement('span')
        //     span.innerHTML = date
        //     span.style.color="red"
        //     return `${date ? `${date} | ${value}` : value}`
        //   },
        // }
        enabled: false,
        intersect: false,
        mode: 'index',
        position: 'average',
        external: function (context: any) {
          let tooltipEl = document.getElementById('chartjs-tooltip')
          let tooltipCircle = document.getElementById('chartjs-tooltip-circle')
          // let circleTimeout;

          if (!tooltipEl) {
            tooltipEl = document.createElement('div')
            tooltipEl.classList.add('barchart-tooltip-container')
            tooltipEl.id = 'chartjs-tooltip'
            tooltipEl.innerHTML = '<div id="tooltipRoot" class="barchart-tooltip-root"></div>'
            document.body.appendChild(tooltipEl)
          }

          if (!tooltipCircle) {
            tooltipCircle = document.createElement('div')
            tooltipCircle.classList.add('barchart-tooltip-circle-outer')
            tooltipCircle.id = 'chartjs-tooltip-circle'
            tooltipCircle.innerHTML = '<div class="barchart-tooltip-circle-inner"></div>'
            document.body.appendChild(tooltipCircle)
          }

          const tooltipModel = context.tooltip
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = '0'
            tooltipCircle.style.opacity = '0'
            return
          }
          const { x, y } = tooltipDataTransform(tooltipModel.dataPoints[0].raw.date, tooltipModel.dataPoints[0].raw.y)
          if (tooltipModel.body) {
            const innerHtml = `
            <div class="barchart-tooltip" id="tooltipBody">
              <div class="barchart-tooltip-label">
              ${x}
              </div>

                <div class="barchart-separator">|</div>

              <div class="barchart-tooltip-value">
                ${y}
              </div>
            </div>
            <div class="barchart-tooltip-bubble-arrow"></div>
            `

            const tooltipRoot = document.getElementById('tooltipRoot')

            if (tooltipRoot) {
              tooltipRoot.innerHTML = innerHtml
            }

            const { top: positionY, left: positionX } = context.chart.canvas.getBoundingClientRect()
            const { caretY, caretX } = tooltipModel

            let circleTop = positionY + window.pageYOffset + caretY - 20 + 14
            let circleLeft = positionX + window.pageXOffset + caretX - 20 / 2

            tooltipEl.style.position = 'absolute'

            tooltipCircle.style.opacity = '0'
            tooltipCircle.style.transform = 'scale(0)'

            clearToooltipTimeouts('circleTimeout')
            tooltipTimeouts.push({
              timeoutKey: 'circleTimeout',
              timeout: setTimeout(() => {
                if (tooltipCircle) {
                  tooltipCircle.style.top = `${circleTop}px`
                  tooltipCircle.style.left = `${circleLeft}px`
                  tooltipCircle.style.transform = 'scale(1)'
                  tooltipCircle.style.opacity = '1'
                }
              }, 300)
            })

            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'

            // get tooltip width after styling cause it is affected by it
            const { height, width } = tooltipEl.getBoundingClientRect()
            let top = positionY + window.pageYOffset + caretY - height - 20
            let left = positionX + window.pageXOffset + caretX - width / 2

            tooltipEl.style.opacity = '1'
            tooltipEl.style.top = `${top}px`
            tooltipEl.style.left = `${left}px`

            clearToooltipTimeouts('tooltipOverflowTimeout')
            tooltipTimeouts.push({
              timeoutKey: 'tooltipOverflowTimeout',
              timeout: setTimeout(() => {
                const x = document.getElementById('chartjs-tooltip')?.getBoundingClientRect().x
                const wid = document.getElementById('chartjs-tooltip')?.getBoundingClientRect().width
                if (x && wid && x + wid > window.innerWidth) {
                  const tooltipBody = document.getElementById('tooltipBody')
                  if (tooltipBody) {
                    tooltipBody.style.right = x + wid - window.innerWidth + 5 + 'px'
                  }
                }
              }, 300)
            })
          }
        }
      }
    }
  })

const BarChart: FC<Props> = ({ chartData, options, datasetOptions = {} }) => {
  const defaultOptions: any = {
    ...defaultChartOptions(),
    ...options
  }

  const data: any = {
    datasets: [
      {
        data: chartData,
        backgroundColor: function (context: any) {
          const chart = context.chart
          const { ctx, chartArea } = chart

          if (!chartArea) {
            return null
          }

          return getGradientBg(ctx, chartArea)
        },
        borderRadius: 100,
        barThickness: 10,
        borderSkipped: false,
        ...datasetOptions
      }
    ]
  }

  const getGradientBg = (ctx: any, chartArea: any) => {
    const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
    gradientBg.addColorStop(0, '#0080FF')
    gradientBg.addColorStop(1, '#334D7E')
    return gradientBg
  }

  useEffect(() => {
    return () => {
      if (document.getElementById('chartjs-tooltip')) {
        document.getElementById('chartjs-tooltip')?.remove()
      }
      if (document.getElementById('chartjs-tooltip-circle')) {
        document.getElementById('chartjs-tooltip-circle')?.remove()
      }
    }
  }, [])
  return (
    <div onMouseOut={() => clearToooltipTimeouts()}>
      <Bar data={data} options={defaultOptions} />
    </div>
  )
}

export default BarChart

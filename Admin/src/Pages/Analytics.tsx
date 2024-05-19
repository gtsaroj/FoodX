import React from 'react'
import {  LineChartOfSellsOfAnalytics, LineChartRevenueOfAnalytics } from '../Components/LineChart/LineChart'

const Analytics : React.FC = () => {
  return (
      <div className='container flex flex-col items-center gap-16 justify-center py-5'>
          <LineChartRevenueOfAnalytics />
           <LineChartOfSellsOfAnalytics/>
    </div>
  )
}

export default Analytics
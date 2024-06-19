import { Mail, Phone } from 'lucide-react'
import React from 'react'

export const EmployeeCard : React.FC = () => {
  return (
      <div className='flex flex-col w-[350px] min-w-[300px] sm:w-[310px]  bg-[var(--light-background)] p-3 rounded-xl items-start justify-center gap-3 '>
          <div className='flex  items-center p-3 justify-center gap-5'>
              <div className='w-[60px] h-[60px] rounded-full bg-slate-400 '>
                  <img className="w-full h-full rounded-full " src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" alt="" />
              </div>
              <div className='flex flex-col items-start justify-center gap-0.5'>
                  <h1 className='text-[15px] font-[600px] contrast-100 '>Rohit Sharma</h1>
                  <p className=' text-[13px] text-[var(--dark-secondary-text)] contrast-100 '>Project Manager</p>
              </div>
          </div>
          <div className='flex flex-col p-3 w-full rounded-xl bg-[var(--light-foreground)] items-start justify-center gap-4'>
              <div className='flex flex-col  items-start justify-center gap-0.5'>
                  <h1 className='text-[15px] font-[600px] contrast-100'>Department</h1>
                  <p className='text-[13px] text-[var(--dark-secondary-text)]  contrast-150'>IT Department</p>
              </div>
              <div className='flex flex-col 
              items-start justify-center gap-2 '>
                  <p className='flex contrast-150
                   items-center justify-center gap-1 text-sm text-[var(--dark-text)] '><Mail className='size-5'/> <span>rohitsharma@gmail.com</span></p>
                  <p className='flex contrast-150
                   items-center justify-center gap-1 text-sm text-[var(--dark-text)] '><Phone className='size-5'/><span>+977-9825506216</span></p>
              </div>
          </div>
    </div>
  )
}

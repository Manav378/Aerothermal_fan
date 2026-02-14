import React from 'react'

const Heatindex = ({parameter}) => {
  return (
   <div
      className="
        w-full
        sm:w-56
        md:w-64
        bg-white
        dark:bg-zinc-800
        rounded-lg
        shadow
        px-3
        py-3
        sm:px-4
        sm:py-4
        select-none
      "
    >
      {/* Label */}
      <p className="text-xs uppercase tracking-wide  select-none text-gray-400 dark:text-gray-500 mb-1">
        HeatIndex
      </p>

      {/* Value */}
      <div className="flex items-end gap-1">
        <p className="text-2xl sm:text-3xl font-semibold  select-none text-gray-800 dark:text-gray-100">
          {parameter.toLocaleString()}
        </p>
        
      </div>

   
    </div>
  )
}

export default Heatindex

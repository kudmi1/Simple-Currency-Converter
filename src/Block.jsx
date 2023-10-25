import { useState } from 'react'
import { Dropdown } from './Dropdown'

/* eslint-disable react/prop-types */

export const Block = ({
	value,
	currency,
	onChangeValue,
	onChangeCurrency,
	allCurrencies,
	currencyDescriptions,
	blockIndex,
	openDropdownIndex,
	setOpenDropdownIndex
}) => {
	const [isOpenDropdown, setOpenDropdown] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)

	return (
		<div className='block text-black lg:mx-4 my-4 max-w-min'>
			<div className='currencies flex border border-gray-300 rounded-md mb-6 h-12 relative items-center overflow-hidden'>
				<div
					className={`bg-blue-600 text-white h-full min-w-[300px] rounded-sm`}
					key={currency}
				>
					<button
						className={`relative flex w-full h-full items-center pl-4 justify-between hover:bg-blue-700 active:bg-blue-800`}
						onClick={(e) => {
							setOpenDropdownIndex(openDropdownIndex !== blockIndex ? blockIndex : null)
							e.stopPropagation()
						}}
					>
						<p
							className={`selection:bg-yellow-200 selection:text-black flex justify-between w-full pr-4`}
						>
							<span>{currencyDescriptions[currency]}</span>
							<span className=''>
								<b>{currency}</b>
							</span>
						</p>
						

						<button
							className={`w-12 h-full flex justify-center items-center outline outline-white/20 outline-1 rounded-md py-2 px-1 pointer-events-auto transition-opacity duration-300 group`}
						>
							<svg
								height='16px'
								viewBox='0 0 50 50'
								width='16px'
								className='fill-white'
							>
								<rect fill='none' height='50' width='50' />
								<polygon points='47.25,15 45.164,12.914 25,33.078 4.836,12.914 2.75,15 25,37.25 ' />
							</svg>
						</button>
					</button>
				</div>
			</div>
			<div className='relative'>
				<Dropdown
					allCurrencies={allCurrencies}
					currencyDescriptions={currencyDescriptions}
					onChangeCurrency={onChangeCurrency}
					isOpenDropdown={openDropdownIndex === blockIndex}
					setOpenDropdown={setOpenDropdown}
					setCurrency={onChangeCurrency}
					blockIndex={blockIndex}
					setOpenDropdownIndex={setOpenDropdownIndex}
					setSelectedIndex={setSelectedIndex}
					selectedIndex={selectedIndex}
				/>
				<p
					className={`absolute left-6 top-0 -translate-y-1/2 bg-white text-base px-2 mb-4 z-30 ${
						isOpenDropdown ? 'opacity-0' : 'opacity-100'
					} duration-300 transition-opacity pointer-events-none`}
				>
					{blockIndex === 1 ? 'From' : 'To'}
				</p>
				<input
					onChange={(e) => onChangeValue(e.target.value)}
					value={value}
					type='number'
					placeholder={0}
					className='relative w-full py-6 bg-white border border-gray-300 rounded-md p-4 text-2xl lg:text-4xl'
				/>
			</div>
		</div>
	)
}

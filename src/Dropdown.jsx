import { useEffect, useRef, useState } from 'react'

/* eslint-disable react/prop-types */
export const Dropdown = ({
	allCurrencies,
	currencyDescriptions,
	onChangeCurrency,
	isOpenDropdown,
	setOpenDropdown,
	setOpenDropdownIndex,
	selectedIndex,
	setSelectedIndex,
}) => {
	const [filterText, setFilterText] = useState('')
	const listRef = useRef(null)
	const inputRef = useRef(null)

	const filteredArray = allCurrencies
		.map((cur) => ({
			code: cur,
			description: currencyDescriptions[cur],
		}))
		.filter((currency) => {
			return (
				currency.code.toLowerCase().includes(filterText.toLowerCase()) ||
				currency.description.toLowerCase().includes(filterText.toLowerCase())
			)
		})
		.sort((a, b) => a.description.localeCompare(b.description))

	const handleCurrencySelection = (selectedCurrency) => {
		onChangeCurrency(selectedCurrency)
		setOpenDropdownIndex(null)
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isOpenDropdown) {
				if (!event.target.closest('.dropdown-container')) {
					setOpenDropdownIndex(null)
				}
			}
		}

		const handleKeyDown = (event) => {
			if (!(isOpenDropdown && listRef.current)) return
			if (event.key === 'Escape') {
				setOpenDropdownIndex(null)
			} else if (event.key === 'ArrowUp' && selectedIndex > 0) {
				setSelectedIndex(selectedIndex - 1)
			} else if (
				event.key === 'ArrowDown' &&
				selectedIndex < filteredArray.length - 1
			) {
				setSelectedIndex(selectedIndex + 1)
			} else if (event.key === 'Enter') {
				if (selectedIndex !== -1) {
					const selectedCurrency = filteredArray[selectedIndex].code
					handleCurrencySelection(selectedCurrency)
				}
			}
		}

		window.addEventListener('click', handleClickOutside)
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('click', handleClickOutside)
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpenDropdown, setOpenDropdown, allCurrencies, selectedIndex])

	useEffect(() => {
		if (isOpenDropdown && listRef.current) {
			listRef.current.focus()
		}
		if (!isOpenDropdown) {
			setSelectedIndex(-1)
		}
		setFilterText('')
	}, [isOpenDropdown])
	useEffect(() => {
		setSelectedIndex(-1)
	}, [isOpenDropdown, filterText])

	useEffect(() => {
		console.log(`Selected index is: ${selectedIndex}`)
	}, [selectedIndex])

	return (
		<div
			className={`dropdown-container bg-white w-full h-fit absolute left-1/2 -translate-x-1/2 top-0 rounded-md z-50 ${
				isOpenDropdown ? 'opacity-100 visible ' : 'opacity-0 invisible'
			} transition-all duration-500 overflow-hidden border-2`}
		>
			<div className='w-full relative flex items-center'>
				<input
					ref={inputRef}
					type='text'
					value={filterText}
					onChange={(e) => {
						setFilterText(e.target.value)
					}}
					className='w-full h-10 bg-white px-2 border-b-2 '
					placeholder='Search'
				/>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='1em'
					height='1em'
					viewBox='0 0 24 24'
					className='absolute right-2 bottom-1/2 translate-y-1/2 text-slate-400 w-6 h-6'
				>
					<path
						fill='currentColor'
						d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z'
					></path>
				</svg>
			</div>
			<ul
				ref={listRef}
				className={`w-full flex flex-col overflow-y-scroll ${
					isOpenDropdown ? 'h-[400px]' : 'h-0'
				} transition-[height] duration-500`}
				tabIndex={0}
			>
				{filteredArray.map((currency, index) => (
					<li
						className={`relative hover:bg-slate-200 cursor-pointer text-center border-b group flex justify-between ${
							selectedIndex === index ? 'bg-slate-200' : ''
						}`}
						key={currency.code}
						onClick={() => {
							handleCurrencySelection(currency.code)
						}}
					>
						<div className='w-full h-full py-2 px-2'>
							<p className='text-start'>{currency.description}</p>
						</div>
						<div className=' min-w-[50px] h-full py-2 flex items-center'>
							<p className='text-start'>{currency.code}</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

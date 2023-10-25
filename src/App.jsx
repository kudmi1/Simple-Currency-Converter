/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { Block } from './Block'

function App() {
	const [fromCurrency, setFromCurrency] = useState('UAH')
	const [toCurrency, setToCurrency] = useState('USD')
	const [fromValue, setFromValue] = useState(1)
	const [toValue, setToValue] = useState(0)
	const [allCurrencies, setAllCurrencies] = useState([])
	const [isEqual, setIsEqual] = useState(false)
	const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
	const descriptionsRef = useRef({})
	const ratesRef = useRef({})

	useEffect(() => {
		fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
			.then((res) => res.json())
			.then((json) => {
				const newRates = json.reduce(
					(ratesObject, item) => {
						ratesObject[item.cc] = item.rate
						return ratesObject
					},
					{ UAH: 1 }
				)
				const descriptions = json.reduce(
					(descriptionObject, item) => {
						descriptionObject[item.cc] = item.txt
						return descriptionObject
					},
					{ UAH: 'Українська гривня' }
				)
				ratesRef.current = newRates
				descriptionsRef.current = descriptions
				setAllCurrencies(Object.keys(newRates))
				onChangeFromValue(fromValue)
			})
			.catch((err) => {
				console.warn(err)
				alert('Не удалось получить информацию')
			})
	}, [])

	const compareCurrencies = () => {
		if (fromCurrency === toCurrency) {
			setIsEqual(true)
		} else {
			setIsEqual(false)
		}
	}

	useEffect(() => {
		compareCurrencies()
	}, [toCurrency, fromCurrency])

	const onChangeFromValue = (value) => {
		const price = value * ratesRef.current[fromCurrency]
		const result = price / ratesRef.current[toCurrency]
		setToValue(result.toFixed(3))
		setFromValue(value)
	}

	const onClickToCurrency = () => {
		const price = fromValue / ratesRef.current[toCurrency]
		const result = price * ratesRef.current[fromCurrency]
		setToValue(result.toFixed(3))
	}

	const onChangeToValue = (value) => {
		const price = value * ratesRef.current[toCurrency]
		const result = price / ratesRef.current[fromCurrency]
		setFromValue(result.toFixed(3))
		setToValue(value)
	}

	const reverseCurrencies = () => {
		if (isEqual) return
		const newFromCurrency = fromCurrency
		setToCurrency(newFromCurrency)
		setFromCurrency(toCurrency)
	}

	useEffect(() => {
		onChangeFromValue(fromValue)
	}, [fromCurrency])

	useEffect(() => {
		onClickToCurrency()
	}, [toCurrency])


	return (
		<div className='App h-screen'>
			<div className='absolute top-12 left-1/2 -translate-x-1/2 bg-white w-screen sm:w-auto lg:max-w-fit flex flex-col lg:flex-row landscape:flex-row p-6 items-center justify-center border rounded-md shadow-lg shadow-black/20'>
				<div></div>
				<Block
					value={fromValue}
					onChangeValue={onChangeFromValue}
					currency={fromCurrency}
					onChangeCurrency={setFromCurrency}
					allCurrencies={allCurrencies}
					currencyDescriptions={descriptionsRef.current}
					blockIndex={1}
					openDropdownIndex={openDropdownIndex}
					setOpenDropdownIndex={setOpenDropdownIndex}
				/>
				<button
					className='reverse-currency-btn rounded-md hover:bg-slate-200'
					onClick={reverseCurrencies}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='1em'
						height='1em'
						viewBox='0 0 20 20'
						className='text-black w-12 h-12 rotate-90 lg:rotate-0'
					>
						<path
							fill='currentColor'
							d='M12.146 3.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L14.293 7H4.5a.5.5 0 0 1 0-1h9.793l-2.147-2.146a.5.5 0 0 1 0-.708Zm-4.292 7a.5.5 0 0 1 0 .708L5.707 13H15.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0Z'
						></path>
					</svg>
				</button>
				<Block
					value={toValue}
					onChangeValue={onChangeToValue}
					currency={toCurrency}
					onChangeCurrency={setToCurrency}
					allCurrencies={allCurrencies}
					currencyDescriptions={descriptionsRef.current}
					blockIndex={2}
					openDropdownIndex={openDropdownIndex}
					setOpenDropdownIndex={setOpenDropdownIndex}
				/>
			</div>
		</div>
	)
}

export default App

import React from 'react'
import Select from 'react-select'

import { fetchBalance, fetchToken, readContract, prepareWriteContract, writeContract } from '@wagmi/core'
import { useAccount } from 'wagmi'

import { ethers } from 'ethers'

import Swap from './GameSwap-Swap'
import GameSwapFarm from './GameSwap-Farm'

const options = [
    {value: 0, label: 'JBC'},
    {value: 1, label: 'CMJ'},
    {value: 2, label: 'JUSDT'}
]

const cmjToken = "0xE67E280f5a354B4AcA15fA7f0ccbF667CF74F97b"
const jusdtToken = "0x24599b658b57f91E7643f4F154B16bcd2884f9ac"
const jcExchange = "0x472d0e2E9839c140786D38110b3251d5ED08DF41"
const juExchange = "0x280608DD7712a5675041b95d0000B9089903B569"
const jcSwap = "0x6784f834EE171C7fB824b2866dD58b6EcF0f2654"
const juSwap = "0x8003b4d3fb5B42AE10A1D8aBE2385dBa7fE978f6"

const providerBKC = new ethers.getDefaultProvider('https://rpc.bitkubchain.io')

const inputStyle = {
    control: (styles, state) => ({
        ...styles,
        width: 95,
        background: 'transparent',
        borderColor: state.isFocused ? 'transparent' : 'transparent',
        fontSize: 16,
    }),
    option: (styles) => ({
        ...styles,
        height: '100%',
        fontSize: 12,
    }),
    indicatorSeparator: (styles) => ({
        ...styles,
        width: 0,
    }),
    placeholder: (styles) => ({
        ...styles,
    }),
    noOptionsMessage: (styles) => ({
        ...styles,
        fontSize: 12,
    }),
    input: (styles) => ({
        ...styles,
        width: 55,
        height: 25,
    }),
    valueContainer: (styles) => ({
        ...styles,
        display: 'block',
        overflow: 'visible',
        width: '50%',
        height: 25,
    }),
    singleValue: (styles) => ({
        ...styles,
        overflow: 'visible',
        fontFamily: 'Inter-ExtraBold',
    }),
    menu: (styles) => ({
        ...styles,
        border: 'rgb(0 0 0 / 4%) 0px 0px 10px, rgb(46 44 53) 0px 0px 0px 1px',
    }),
}
   
const GameSwap = ({ setisLoading, txupdate, setTxupdate, erc20ABI, exchangeABI, exchangeJulpABI, farmJdaoABI, swapABI, swapJulpABI, bkcOracleABI }) => {
    const { address } = useAccount()

    const [mode, setMode] = React.useState(0)

    const [jbcBalance, setJbcBalance] = React.useState(<>0.000</>)
    const [cmjBalance, setCmjBalance] = React.useState(<>0.000</>)
    const [cmjBalanceFull, setCmjBalanceFull] = React.useState(null)
    const [jusdtBalance, setJusdtBalance] = React.useState(<>0.000</>)

    const [jbcReserv, setJbcReserv] = React.useState(0)
    const [cmjReserv, setCmjReserv] = React.useState(0)
    const [jbcJuReserv, setJbcJuReserv] = React.useState(0)
    const [jusdtJuReserv, setJusdtJuReserv] = React.useState(0)
    
    const [liquidMode, setLiquidMode] = React.useState(0)
    const liquidModeSelect = async (option) => {
        if (liquidMode === 0 && option.value === 1) { setLiquidMode(0) }
        if (liquidMode === 0 && option.value === 2) { setLiquidMode(1) }
        if (liquidMode === 1 && option.value === 1) { setLiquidMode(0) }
        if (liquidMode === 1 && option.value === 2) { setLiquidMode(1) }
    }

    const [jbcAdd, setJbcAdd] = React.useState("")
    const [cmjAdd, setCmjAdd] = React.useState("")
    const [jbcJuAdd, setJbcJuAdd] = React.useState("")
    const [jusdtJuAdd, setJusdtJuAdd] = React.useState("")

    const handleAdd = async (event) => {
        setJbcAdd(event.target.value)
        const _value = event.target.value !== "" ? ethers.utils.parseEther(event.target.value) : 0
        const bigValue = ethers.BigNumber.from(_value)
        const _reserveJbc = await fetchBalance({ address: jcExchange, })
        const bigJbcReserv = ethers.BigNumber.from(_reserveJbc.value)
        const _reserveCmj = await readContract({
            address: jcExchange,
            abi: exchangeABI,
            functionName: 'getReserve',
        })
        const bigCmjReserv = ethers.BigNumber.from(_reserveCmj)
        event.target.value !== "" ? setCmjAdd(ethers.utils.formatEther(((bigValue.mul(bigCmjReserv)).div(bigJbcReserv)))) : setCmjAdd("")
    }
    const maxLiqHandle1 = async () => {
        const _max = address !== undefined ? await fetchBalance({ address: address, }) : {formatted: 0}
        const maxSubGas = Number(_max.formatted) - 0.009
        setJbcAdd(String(maxSubGas))
        const _value = maxSubGas >= 0 ? ethers.utils.parseEther(String(maxSubGas)) : 0
        const bigValue = ethers.BigNumber.from(_value)
        const _reserveJbc = await fetchBalance({ address: jcExchange, })
        const bigJbcReserv = ethers.BigNumber.from(_reserveJbc.value)
        const _reserveCmj = await readContract({
            address: jcExchange,
            abi: exchangeABI,
            functionName: 'getReserve',
        })
        const bigCmjReserv = ethers.BigNumber.from(_reserveCmj)
        maxSubGas >= 0 ? setCmjAdd(ethers.utils.formatEther(((bigValue.mul(bigCmjReserv)).div(bigJbcReserv)))) : setCmjAdd("")
    }
    const handleAdd2 = async (event) => {
        setCmjAdd(event.target.value)
        const _value = event.target.value !== "" ? ethers.utils.parseEther(event.target.value) : 0
        const bigValue = ethers.BigNumber.from(_value)
        const _reserveJbc = await fetchBalance({ address: jcExchange, })
        const bigJbcReserv = ethers.BigNumber.from(_reserveJbc.value)
        const _reserveCmj = await readContract({
            address: jcExchange,
            abi: exchangeABI,
            functionName: 'getReserve',
        })
        const bigCmjReserv = ethers.BigNumber.from(_reserveCmj)
        event.target.value !== "" ? setJbcAdd(ethers.utils.formatEther(((bigValue.mul(bigJbcReserv)).div(bigCmjReserv)))) : setJbcAdd("")
    }
    const maxLiqHandle2 = async () => {
        const _max = address !== undefined ? await readContract({
            address: cmjToken,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [address],
        }) : 0
        setCmjAdd(ethers.utils.formatEther(_max))
        const _value = _max >= 0 ? _max : 0
        const bigValue = ethers.BigNumber.from(_value)
        const _reserveJbc = await fetchBalance({ address: jcExchange, })
        const bigJbcReserv = ethers.BigNumber.from(_reserveJbc.value)
        const _reserveCmj = await readContract({
            address: jcExchange,
            abi: exchangeABI,
            functionName: 'getReserve',
        })
        const bigCmjReserv = ethers.BigNumber.from(_reserveCmj)
        _max >= 0 ? setJbcAdd(ethers.utils.formatEther(((bigValue.mul(bigJbcReserv)).div(bigCmjReserv)))) : setJbcAdd("")
    }
    const handleAdd3 = async (event) => {
        setJbcJuAdd(event.target.value)
        const _value = event.target.value !== "" ? ethers.utils.parseEther(event.target.value) : 0
        const bigValue = ethers.BigNumber.from(_value)
        const _reserveJbc = await fetchBalance({ address: juExchange, })
        const bigJbcReserv = ethers.BigNumber.from(_reserveJbc.value)
        const _reserveJusdt = await readContract({
            address: juExchange,
            abi: exchangeJulpABI,
            functionName: 'getReserve',
        })
        const bigJusdtReserv = ethers.BigNumber.from(_reserveJusdt)
        event.target.value !== "" ? setJusdtJuAdd(ethers.utils.formatEther(((bigValue.mul(bigJusdtReserv)).div(bigJbcReserv)))) : setJusdtJuAdd("")
    }
    const maxLiqHandle3 = async () => {
        const _max = address !== undefined ? await fetchBalance({ address: address, }) : {formatted: 0}
        const maxSubGas = Number(_max.formatted) - 0.009
        setJbcJuAdd(String(maxSubGas))
        const _value = maxSubGas >= 0 ? ethers.utils.parseEther(String(maxSubGas)) : 0
        const bigValue = ethers.BigNumber.from(_value)
        const _reserveJbc = await fetchBalance({ address: juExchange, })
        const bigJbcReserv = ethers.BigNumber.from(_reserveJbc.value)
        const _reserveJusdt = await readContract({
            address: juExchange,
            abi: exchangeJulpABI,
            functionName: 'getReserve',
        })
        const bigJusdtReserv = ethers.BigNumber.from(_reserveJusdt)
        _value >= 0 ? setJusdtJuAdd(ethers.utils.formatEther(((bigValue.mul(bigJusdtReserv)).div(bigJbcReserv)))) : setJusdtJuAdd("")
    }
    const handleAdd4 = async (event) => {
        setJusdtJuAdd(event.target.value)
        const _value = event.target.value !== "" ? ethers.utils.parseEther(event.target.value) : 0
        const bigValue = ethers.BigNumber.from(_value)
        const _reserveJbc = await fetchBalance({ address: juExchange, })
        const bigJbcReserv = ethers.BigNumber.from(_reserveJbc.value)
        const _reserveJusdt = await readContract({
            address: juExchange,
            abi: exchangeJulpABI,
            functionName: 'getReserve',
        })
        const bigJusdtReserv = ethers.BigNumber.from(_reserveJusdt)
        event.target.value !== "" ? setJbcJuAdd(ethers.utils.formatEther(((bigValue.mul(bigJbcReserv)).div(bigJusdtReserv)))) : setJbcJuAdd("")
    }
    const maxLiqHandle4 = async () => {
        const _max = address !== undefined ? await readContract({
            address: jusdtToken,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [address],
        }) : 0
        setJusdtJuAdd(ethers.utils.formatEther(_max))
        const _value = _max >= 0 ? _max : 0
        const bigValue = ethers.BigNumber.from(_value)
        const _reserveJbc = await fetchBalance({ address: juExchange, })
        const bigJbcReserv = ethers.BigNumber.from(_reserveJbc.value)
        const _reserveJusdt = await readContract({
            address: juExchange,
            abi: exchangeJulpABI,
            functionName: 'getReserve',
        })
        const bigJusdtReserv = ethers.BigNumber.from(_reserveJusdt)
        _max >= 0 ? setJbcJuAdd(ethers.utils.formatEther(((bigValue.mul(bigJbcReserv)).div(bigJusdtReserv)))) : setJbcJuAdd("")
    }

    const addliqHandle = async () => {
        setisLoading(true)
        const cmAllow = await readContract({
            address: cmjToken,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [address, jcExchange],
        })
        const bigValue = cmjAdd !== "" ? ethers.BigNumber.from(ethers.utils.parseEther(cmjAdd)) : ethers.BigNumber.from(0)
        const Hex = ethers.BigNumber.from(10**8)
        const bigApprove = bigValue.mul(Hex)
        if (Number(cmjAdd) > Number(cmAllow) / (10**18)) {
            try {
                const config = await prepareWriteContract({
                    address: cmjToken,
                    abi: erc20ABI,
                    functionName: 'approve',
                    args: [jcExchange, bigApprove],
                })
                const approvetx = await writeContract(config)
                await approvetx.wait()
            } catch {}
        }
        try {
            const config2 = await prepareWriteContract({
                address: jcExchange,
                abi: exchangeABI,
                functionName: 'addLiquidity',
                args: [ethers.utils.parseEther(cmjAdd)],
                overrides: {
                    value: ethers.utils.parseEther(jbcAdd),
                },
            })
            const tx = await writeContract(config2)
            await tx.wait()
            setTxupdate(tx)
        } catch {}
        setisLoading(false)
    }
    const addliqHandle2 = async () => {
        setisLoading(true)
        const jusdtAllow = await readContract({
            address: jusdtToken,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [address, juExchange],
        })
        const bigValue = jusdtJuAdd !== "" ? ethers.BigNumber.from(ethers.utils.parseEther(jusdtJuAdd)) : ethers.BigNumber.from(0)
        const Hex = ethers.BigNumber.from(10**8)
        const bigApprove = bigValue.mul(Hex)
        if (Number(jusdtJuAdd) > Number(jusdtAllow) / (10**18)) {
            try {
                const config = await prepareWriteContract({
                    address: jusdtToken,
                    abi: erc20ABI,
                    functionName: 'approve',
                    args: [juExchange, bigApprove],
                })
                const approvetx = await writeContract(config)
                await approvetx.wait()
            } catch {}
        }
        try {
            const config2 = await prepareWriteContract({
                address: juExchange,
                abi: exchangeJulpABI,
                functionName: 'addLiquidity',
                args: [ethers.utils.parseEther(jusdtJuAdd)],
                overrides: {
                    value: ethers.utils.parseEther(jbcJuAdd),
                },
            })
            const tx = await writeContract(config2)
            await tx.wait()
            setTxupdate(tx)
        } catch {}
        setisLoading(false)
    }

    const [lpSell, setLpSell] = React.useState("")
    const [julpSell, setJulpSell] = React.useState("")

    const handleSell = (event) => { setLpSell(event.target.value) }
    const maxRemLiqHandle1 = async () => {
        const jclpBal = address !== undefined ? await readContract({
            address: jcExchange,
            abi: exchangeABI,
            functionName: 'balanceOf',
            args: [address],
        }) : 0
        setLpSell(ethers.utils.formatEther(jclpBal))
    }
    const removeliqHandle = async () => {
        setisLoading(true)
        try {
            const config = await prepareWriteContract({
                address: jcExchange,
                abi: exchangeABI,
                functionName: 'removeLiquidity',
                args: [ethers.utils.parseEther(lpSell)],
            })
            const tx = await writeContract(config)
            await tx.wait()
            setTxupdate(tx)
        } catch {}
        setisLoading(false)
    }
    const handleSell2 = (event) => { setJulpSell(event.target.value) }
    const maxRemLiqHandle2 = async () => {
        const julpBal = address !== undefined ? await readContract({
            address: juExchange,
            abi: exchangeJulpABI,
            functionName: 'balanceOf',
            args: [address],
        }) : 0
        setJulpSell(ethers.utils.formatEther(julpBal))
    }
    const removeliqHandle2 = async () => {
        setisLoading(true)
        try {
            const config = await prepareWriteContract({
                address: juExchange,
                abi: exchangeJulpABI,
                functionName: 'removeLiquidity',
                args: [ethers.utils.parseEther(julpSell)],
            })
            const tx = await writeContract(config)
            await tx.wait()
            setTxupdate(tx)
        } catch {}
        setisLoading(false)
    }

    const [lpBalance, setLpBalance] = React.useState(null)
    const [lpShare, setLpShare] = React.useState(0)
    const [jbcPooled, setJbcPooled] = React.useState(null)
    const [cmjPooled, setCmjPooled] = React.useState(null)

    const [julpBalance, setJulpBalance] = React.useState(null)
    const [julpShare, setJulpShare] = React.useState(0)
    const [jbcjuPooled, setJbcjuPooled] = React.useState(null)
    const [jusdtjuPooled, setJusdtjuPooled] = React.useState(null)

    const [priceTHB, setPriceTHB] = React.useState(0)

    React.useEffect(() => {
        const thefetch = async () => {
            const jbcBal = address !== null && address !== undefined ? await fetchBalance({ address: address, }) : {formatted: 0}
            
            const res = address !== null && address !== undefined ? await (await fetch("https://graph.jibchain.net/subgraphs/name/jbc/all", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    query: `{
                        account(id: "` + address + `") {
                            ERC20balances {
                              id
                              valueExact
                            }
                        }
                    }`
                })
            })).json() : null
            const _res = res !== null && res.data.account !== null ? res.data.account.ERC20balances : []

            let cmjBal = 0
            let jusdtBal = 0 
            let jclpBal = 0
            let julpBal = 0
            for (let i = 0; i <= _res.length - 1; i++) {
                if (_res[i].id.slice(0, 42).toUpperCase() === cmjToken.toUpperCase()) {
                    cmjBal = _res[i].valueExact
                } else if (_res[i].id.slice(0, 42).toUpperCase() === jusdtToken.toUpperCase()) {
                    jusdtBal = _res[i].valueExact
                } else if (_res[i].id.slice(0, 42).toUpperCase() === jcExchange.toUpperCase()) {
                    jclpBal = _res[i].valueExact
                } else if (_res[i].id.slice(0, 42).toUpperCase() === juExchange.toUpperCase()) {
                    julpBal = _res[i].valueExact
                }
            }

            const JbcJcReserv = await fetchBalance({ address: jcExchange, })
            const CmjJcReserv = await readContract({
                address: jcExchange,
                abi: exchangeABI,
                functionName: 'getReserve',
            })
            const JbcJuReserv = await fetchBalance({ address: juExchange, })
            const JusdtJuReserv = await readContract({
                address: juExchange,
                abi: exchangeJulpABI,
                functionName: 'getReserve',
            })

            const jclpTotalSup = await fetchToken({
                address: jcExchange,
            })
            const julpTotalSup = await fetchToken({
                address: juExchange,
            })

            const oracleTHB = new ethers.Contract("0x4A6947323A1c14Cf69Dd128A2cf854364239d044", bkcOracleABI, providerBKC)
            const usdtToTHB = await oracleTHB.latestAnswer()
            
            return [
                jbcBal, cmjBal, jusdtBal,
                JbcJcReserv, CmjJcReserv, JbcJuReserv, JusdtJuReserv,
                jclpBal, jclpTotalSup, julpBal, julpTotalSup,
                usdtToTHB
            ]
        }

        const promise = thefetch()

        const getAsync = () =>
            new Promise((resolve) => 
                setTimeout(
                    () => resolve(promise), 1000
                )
            )

        getAsync().then(result => {
            setJbcBalance(Number(Math.floor((result[0].formatted) * 1000) / 1000).toLocaleString('en-US', {minimumFractionDigits:3}))
            const _cmjbalance = ethers.utils.formatEther(result[1])
            setCmjBalanceFull(Number(_cmjbalance))
            setCmjBalance(Number(Math.floor(_cmjbalance * 1000) / 1000).toLocaleString('en-US', {minimumFractionDigits:3}))
            const _jusdtbalance = ethers.utils.formatEther(result[2])
            setJusdtBalance(Number(Math.floor(_jusdtbalance * 1000) / 1000).toLocaleString('en-US', {minimumFractionDigits:3}))

            const _jbcreserve = ethers.utils.formatEther(result[3].value)
            setJbcReserv(_jbcreserve)
            const _cmjreserve = ethers.utils.formatEther(result[4])
            setCmjReserv(_cmjreserve)
            const _jbcjureserve = ethers.utils.formatEther(result[5].value)
            setJbcJuReserv(_jbcjureserve)
            const _jusdtjureserve = ethers.utils.formatEther(result[6])
            setJusdtJuReserv(_jusdtjureserve)

            const _lpbalance = ethers.utils.formatEther(result[7])
            setLpBalance(Math.floor(_lpbalance * 1000) / 1000)
            const _lptotalsupply = result[8].totalSupply.formatted
            setLpShare(Number((_lpbalance / _lptotalsupply) * 100).toFixed(4))

            setJbcPooled((Number(_jbcreserve) * Number(_lpbalance)) / Number(_lptotalsupply))
            setCmjPooled((Number(_cmjreserve) * Number(_lpbalance)) / Number(_lptotalsupply))

            const _julpbalance = ethers.utils.formatEther(result[9])
            setJulpBalance(Math.floor(_julpbalance * 1000) / 1000)
            const _julptotalsupply = result[10].totalSupply.formatted
            setJulpShare(Number((_julpbalance / _julptotalsupply) * 100).toFixed(4))
            setJbcjuPooled((Number(_jbcjureserve) * Number(_julpbalance)) / Number(_julptotalsupply))
            setJusdtjuPooled((Number(_jusdtjureserve) * Number(_julpbalance)) / Number(_julptotalsupply))

            setPriceTHB(ethers.utils.formatEther(result[11]) * (10**10))
        })
    }, [address, txupdate, exchangeABI, exchangeJulpABI, bkcOracleABI])


    return (
        <div style={{flexDirection: "column", alignItems: "center", justifyContent: "flex-start"}} className="collection">
            <div style={{marginTop: "80px", height: "25px", width: "fit-content", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                {mode === 0 ? 
                    <div style={{margin: "0 10px", width: "fit-content", border: "transparent", background: "transparent", fontSize: "20px", borderBottom: "5px solid #61dafb", cursor: "pointer"}} className="bold">Swap</div> :
                    <div style={{margin: "0 10px", width: "fit-content", border: "transparent", background: "transparent", fontSize: "20px", color: "#b8add2", borderBottom: "5px solid transparent", cursor: "pointer"}} className="bold" onClick={() => {setMode(0)}}>Swap</div>
                }
                {mode === 1 ?
                    <div style={{margin: "0 10px", width: "fit-content", border: "transparent", background: "transparent", fontSize: "20px", borderBottom: "5px solid #61dafb", cursor: "pointer"}} className="bold">Liquidity</div> :
                    <div style={{margin: "0 10px", width: "fit-content", border: "transparent", background: "transparent", fontSize: "20px", color: "#b8add2", borderBottom: "5px solid transparent", cursor: "pointer"}} className="bold" onClick={() => {setMode(1)}}>Liquidity</div>
                }
                {mode === 2 ?
                    <div style={{margin: "0 10px", width: "fit-content", border: "transparent", background: "transparent", fontSize: "20px", borderBottom: "5px solid #61dafb", cursor: "pointer"}} className="bold">Farms</div> :
                    <div style={{margin: "0 10px", width: "fit-content", border: "transparent", background: "transparent", fontSize: "20px", color: "#b8add2", borderBottom: "5px solid transparent", cursor: "pointer"}} className="bold" onClick={() => {setMode(2)}}>Farms</div>
                }
            </div>
            {mode === 0 ? <Swap
                address={address}
                setisLoading={setisLoading}
                setTxupdate={setTxupdate}
                options={options}
                inputStyle={inputStyle}
                jcExchange={jcExchange}
                exchangeABI={exchangeABI}
                juExchange={juExchange}
                exchangeJulpABI={exchangeJulpABI}
                jcSwap={jcSwap}
                swapABI={swapABI}
                juSwap={juSwap}
                swapJulpABI={swapJulpABI}
                cmjToken={cmjToken}
                jusdtToken={jusdtToken}
                erc20ABI={erc20ABI}
                jbcBalance={jbcBalance}
                cmjBalance={cmjBalance}
                jusdtBalance={jusdtBalance}
                jbcReserv={jbcReserv}
                cmjReserv={cmjReserv}
                jbcJuReserv={jbcJuReserv}
                jusdtJuReserv={jusdtJuReserv}
                priceTHB={priceTHB}
            /> : <></>}
            {mode === 1 ?
                <div style={{margin: "20px 0", width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
                    <div style={{margin: "20px", padding: "20px 0", height: "450px"}} className="nftCard">
                        <div style={{width: "85%", textAlign: "left", fontSize: "20px"}} className="bold">Add LP</div>
                        <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                            <div style={{display: "flex"}}>
                                <img style={{width: "38px", height: "38px", marginRight: "2.5px"}} src="../tokens/jbc.png" alt="$JBC"></img>
                                <Select
                                    options={[]}
                                    value={options[0]}
                                    styles={inputStyle}
                                    isSearchable={false}
                                />
                            </div>
                            <div style={{height: "38px", lineHeight: 3, fontSize: "12px"}}>Balance: {jbcBalance}</div>
                        </div>
                        {liquidMode === 0 ?
                            <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                <input
                                    placeholder="0.0"
                                    style={{alignSelf: "flex-start", marginTop: 0, width: "190px", height: "40px", padding: "5px 20px", border: "1px solid #dddade"}}
                                    onChange={handleAdd}
                                    value={jbcAdd}
                                />
                                <div style={{padding: "15px 10px", border: "1px solid #dddade", cursor: "pointer"}} className="bold" onClick={maxLiqHandle1}>Max</div>
                            </div> :
                            <></>
                        }
                        {liquidMode === 1 ?
                            <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                <input
                                    placeholder="0.0"
                                    style={{alignSelf: "flex-start", marginTop: 0, width: "190px", height: "40px", padding: "5px 20px", border: "1px solid #dddade"}}
                                    onChange={handleAdd3}
                                    value={jbcJuAdd}
                                /> 
                                <div style={{padding: "15px 10px", border: "1px solid #dddade", cursor: "pointer"}} className="bold" onClick={maxLiqHandle3}>Max</div>
                            </div>:
                            <></>
                        }
                        <div className="fa fa-plus"></div>
                        <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                            <div style={{display: "flex"}}>
                                {liquidMode === 0 ? <img style={{width: "38px", height: "38px", marginRight: "2.5px"}} src="../tokens/cmj.png" alt="$CMJ"></img> : <></>}
                                {liquidMode === 1 ? <img style={{width: "38px", height: "38px", marginRight: "2.5px"}} src="../tokens/jusdt.png" alt="$JUSDT"></img> : <></>}
                                {liquidMode === 0 ?
                                    <>
                                        <Select
                                            onChange={liquidModeSelect}
                                            options={options.filter(option => option.value !== 0)}
                                            value={options[1]}
                                            styles={inputStyle}
                                            isSearchable={false}
                                        />
                                        <a href="https://exp-l1.jibchain.net/token/0xE67E280f5a354B4AcA15fA7f0ccbF667CF74F97b/" target="_blank" rel="noreferrer"><i className="fa fa-external-link" style={{fontSize: "16px", marginLeft: "5px", lineHeight: 2.3}}></i></a>
                                    </> :
                                    <></>
                                }
                                {liquidMode === 1 ?
                                <>
                                    <Select
                                        onChange={liquidModeSelect}
                                        options={options.filter(option => option.value !== 0)}
                                        value={options[2]}
                                        styles={inputStyle}
                                        isSearchable={false}
                                    />
                                    <a href="https://exp-l1.jibchain.net/token/0x24599b658b57f91E7643f4F154B16bcd2884f9ac/" target="_blank" rel="noreferrer"><i className="fa fa-external-link" style={{fontSize: "16px", marginLeft: "5px", lineHeight: 2.3}}></i></a>
                                </> :
                                <></>
                            }
                            </div>
                            {liquidMode === 0 ? <div style={{height: "38px", lineHeight: 3, fontSize: "12px"}}>Balance: {cmjBalance}</div> : <></>}
                            {liquidMode === 1 ? <div style={{height: "38px", lineHeight: 3, fontSize: "12px"}}>Balance: {jusdtBalance}</div> : <></>}
                        </div>
                        {liquidMode === 0 ?
                            <>
                                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                    <input
                                        placeholder="0.0"
                                        style={{alignSelf: "flex-start", marginTop: 0, width: "190px", height: "40px", padding: "5px 20px", border: "1px solid #dddade"}}
                                        onChange={handleAdd2}
                                        value={cmjAdd}
                                    />
                                    <div style={{padding: "15px 10px", border: "1px solid #dddade", cursor: "pointer"}} className="bold" onClick={maxLiqHandle2}>Max</div>
                                </div>
                                <div style={{letterSpacing: "1px", width: "240px", padding: "15px 30px", height: "fit-content", cursor: "pointer", borderRadius: "16px", backgroundColor: "rgb(97, 218, 251)", color: "#fff", fontSize: "18px"}} className="bold" onClick={addliqHandle}>Add</div>
                            </> :
                            <></>
                        }
                        {liquidMode === 1 ?
                            <>
                                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                    <input
                                        placeholder="0.0"
                                        style={{alignSelf: "flex-start", marginTop: 0, width: "190px", height: "40px", padding: "5px 20px", border: "1px solid #dddade"}}
                                        onChange={handleAdd4}
                                        value={jusdtJuAdd}
                                    />
                                    <div style={{padding: "15px 10px", border: "1px solid #dddade", cursor: "pointer"}} className="bold" onClick={maxLiqHandle4}>Max</div>
                                </div>
                                <div style={{letterSpacing: "1px", width: "240px", padding: "15px 30px", height: "fit-content", cursor: "pointer", borderRadius: "16px", backgroundColor: "rgb(97, 218, 251)", color: "#fff", fontSize: "18px"}} className="bold" onClick={addliqHandle2}>Add</div>
                            </> :
                            <></>
                        }
                    </div>
                    <div style={{margin: "20px", padding: "20px 0", height: "450px"}} className="nftCard">
                        <div style={{width: "85%", textAlign: "left", fontSize: "20px"}} className="bold">Remove LP</div>
                        {liquidMode === 0 ?
                            <>
                                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                    <div style={{display: "flex"}}>
                                        <img style={{width: "38px", height: "38px", marginRight: "2.5px"}} src="../tokens/jbc.png" alt="$JBC"></img>
                                        <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>POOLED JBC:</div>
                                    </div>
                                    <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>
                                        {jbcPooled !== null ? <>{jbcPooled.toLocaleString('en-US', {minimumFractionDigits:3})}</> : <>0.000</>}
                                    </div>
                                </div>
                                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                    <div style={{display: "flex"}}>
                                        <img style={{width: "38px", height: "38px", marginRight: "2.5px"}} src="../tokens/cmj.png" alt="$CMJ"></img>
                                        <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>POOLED CMJ:</div>
                                    </div>
                                    <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>
                                        {cmjPooled !== null ? <>{cmjPooled.toLocaleString('en-US', {minimumFractionDigits:3})}</> : <>0.000</>}
                                    </div>
                                </div>
                            </> :
                            <></>
                        }
                        {liquidMode === 1 ?
                            <>
                                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                    <div style={{display: "flex"}}>
                                        <img style={{width: "38px", height: "38px", marginRight: "2.5px"}} src="../tokens/jbc.png" alt="$JBC"></img>
                                        <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>POOLED JBC:</div>
                                    </div>
                                    <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>
                                        {jbcjuPooled !== null ? <>{jbcjuPooled.toLocaleString('en-US', {minimumFractionDigits:3})}</> : <>0.000</>}
                                    </div>
                                </div>
                                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                    <div style={{display: "flex"}}>
                                        <img style={{width: "38px", height: "38px", marginRight: "2.5px"}} src="../tokens/jusdt.png" alt="$JUSDT"></img>
                                        <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>POOLED JUSDT:</div>
                                    </div>
                                    <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>
                                        {jusdtjuPooled !== null ? <>{jusdtjuPooled.toLocaleString('en-US', {minimumFractionDigits:3})}</> : <>0.000</>}
                                    </div>
                                </div>
                            </> :
                            <></>
                        }
                        <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                            <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>LP VALUE:</div>
                            <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>
                                {jbcReserv !== 0 ?
                                    <>
                                        {liquidMode === 0 ? <>~{(Math.floor((jbcPooled + (cmjPooled * (jbcReserv/cmjReserv))) * (jusdtJuReserv/jbcJuReserv) * priceTHB * 100) / 100).toLocaleString('en-US', {minimumFractionDigits:2})} THB</> : <></>}
                                        {liquidMode === 1 ? <>~{(Math.floor((jusdtjuPooled + (jbcjuPooled * (jusdtJuReserv/jbcJuReserv))) * priceTHB * 100) / 100).toLocaleString('en-US', {minimumFractionDigits:2})} THB</> : <></>} 
                                    </> :
                                    <>0.000</>
                                }
                            </div>
                        </div>
                        <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                            <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>POOL SHARE:</div>
                            <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>
                                {lpShare !== 0 && julpShare !== 0 ?
                                    <>
                                        {liquidMode === 0 ? <>{lpShare}%</> : <></>}
                                        {liquidMode === 1 ? <>{julpShare}%</> : <></>}
                                    </> :
                                    <>0.000</>
                                }
                            </div>
                        </div>
                        {liquidMode === 0 ?
                            <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>JBC/CMJ LP<a href="https://exp-l1.jibchain.net/token/0x472d0e2E9839c140786D38110b3251d5ED08DF41/" target="_blank" rel="noreferrer"><i className="fa fa-external-link" style={{fontSize: "16px", marginLeft: "5px", lineHeight: 2.3}}></i></a></div>
                                <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>
                                    {lpBalance !== null ? <>Balance: {lpBalance.toLocaleString('en-US', {minimumFractionDigits:3})}</> : <>0.000</>}
                                </div>
                            </div> :
                            <></>
                        }
                        {liquidMode === 1 ?
                            <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>JBC/JUSDT LP<a href="https://exp-l1.jibchain.net/token/0x280608DD7712a5675041b95d0000B9089903B569/" target="_blank" rel="noreferrer"><i className="fa fa-external-link" style={{fontSize: "16px", marginLeft: "5px", lineHeight: 2.3}}></i></a></div>
                                <div style={{marginLeft: "5px", height: "25px", lineHeight: 2.5, fontSize: "16px"}}>
                                    {julpBalance !== null ? <>Balance: {julpBalance.toLocaleString('en-US', {minimumFractionDigits:3})}</> : <>0.000</>}
                                </div>
                            </div> :
                            <></>
                        }
                        {liquidMode === 0 ?
                            <>
                                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                    <input
                                        placeholder="0.0"
                                        style={{alignSelf: "flex-start", marginTop: 0, width: "190px", height: "40px", padding: "5px 20px", border: "1px solid #dddade"}}
                                        onChange={handleSell}
                                        value={lpSell}
                                    />
                                    <div style={{padding: "15px 10px", border: "1px solid #dddade", cursor: "pointer"}} className="bold" onClick={maxRemLiqHandle1}>Max</div>
                                </div>
                                <div style={{letterSpacing: "1px", width: "240px", padding: "15px 30px", height: "fit-content", cursor: "pointer", borderRadius: "16px", backgroundColor: "rgb(97, 218, 251)", color: "#fff", fontSize: "18px"}} className="bold" onClick={removeliqHandle}>Remove</div>
                            </> :
                            <></>
                        }
                        {liquidMode === 1 ?
                            <>
                                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                                    <input
                                        placeholder="0.0"
                                        style={{alignSelf: "flex-start", marginTop: 0, width: "190px", height: "40px", padding: "5px 20px", border: "1px solid #dddade"}}
                                        onChange={handleSell2}
                                        value={julpSell}
                                    />
                                    <div style={{padding: "15px 10px", border: "1px solid #dddade", cursor: "pointer"}} className="bold" onClick={maxRemLiqHandle2}>Max</div>
                                </div>
                                <div style={{letterSpacing: "1px", width: "240px", padding: "15px 30px", height: "fit-content", cursor: "pointer", borderRadius: "16px", backgroundColor: "rgb(97, 218, 251)", color: "#fff", fontSize: "18px"}} className="bold" onClick={removeliqHandle2}>Remove</div>
                            </> :
                            <></>
                        }
                    </div>
                </div> :
                <></>
            }
            {mode === 2 ? <GameSwapFarm
                address={address}
                setisLoading={setisLoading}
                setTxupdate={setTxupdate}
                txupdate={txupdate}
                lpBalance={lpBalance}
                julpBalance={julpBalance}
                jbcPooled={jbcPooled}
                cmjPooled={cmjPooled}
                jbcjuPooled={jbcjuPooled}
                jusdtjuPooled={jusdtjuPooled}
                jcExchange={jcExchange}
                exchangeABI={exchangeABI}
                juExchange={juExchange}
                exchangeJulpABI={exchangeJulpABI}
                cmjToken={cmjToken}
                erc20ABI={erc20ABI}
                cmjBalance={cmjBalance}
                jbcReserv={jbcReserv}
                cmjReserv={cmjReserv}
                jbcJuReserv={jbcJuReserv}
                jusdtJuReserv={jusdtJuReserv}
                cmjBalanceFull={cmjBalanceFull}
                farmJdaoABI={farmJdaoABI}
                priceTHB={priceTHB}
            /> : <></>}
        </div>
    )
}

export default GameSwap
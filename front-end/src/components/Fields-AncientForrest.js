import React from 'react'
import { ethers } from 'ethers'
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core'
import { useAccount } from 'wagmi'

const CMDS = '0xAF17Dc881204488d929a5D377eBCF3256130b335'
const starterCMDS = '0x936322111e1c9dCa38a721C1E07b9ec553BF2f04'
const uplevelCMDS = '0x5fCf6Bd82Bd156Ef4DBef47f2997F91bD3E214BB'
const fieldWood = '0xc2744Ff255518a736505cF9aC1996D9adDec69Bd'

const FieldsAncientForrest = ({ setisLoading, txupdate, setTxupdate, aurora721ABI, starterCMDSABI, uplevelCMDSABI, woodFieldABI }) => {
    const { address } = useAccount()

    const [inputName, setInputName] = React.useState("")
    const [nft, setNft] = React.useState([])

    React.useEffect(() => {
        setNft([])

        const thefetch = async () => {
            let nfts = []

            const res = address !== null && address !== undefined ? await (await fetch("https://graph.jibchain.net/subgraphs/name/jbc/all", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    query: `{
                        account(id: "` + fieldWood + `") {
                            ERC721tokens(id: "` + fieldWood + `", first: 1000) {
                                id
                                uri
                                transfers(orderBy: timestamp, orderDirection: desc, first: 2) {
                                    to {
                                        id
                                    }
                                }
                            }
                        }
                    }`
                })
            })).json() : null
            const _res = res !== null && res.data.account !== null ? res.data.account.ERC721tokens : []
            let yournftstake = []
            for (let i = 0; i <= _res.length - 1 && address !== null && address !== undefined ; i++) {
                if ((_res[i].transfers[0].to.id).toUpperCase() === fieldWood.toUpperCase()) {
                    if ((_res[i].transfers[1].to.id).toUpperCase() === address.toUpperCase()) {
                        yournftstake.push({Id: _res[i].id.slice(43), URI: _res[i].uri})
                    }
                }
            }

            for (let i = 0; i <= yournftstake.length - 1; i++) {
                const nftipfs = yournftstake[i].URI
                const response = await fetch(nftipfs.replace("ipfs://", "https://").concat(".ipfs.nftstorage.link/"))
                const nft = await response.json()

                const nftData = await readContract({
                    address: starterCMDS,
                    abi: starterCMDSABI,
                    functionName: 'nftData',
                    args: [String(ethers.BigNumber.from(String(10000000000000000000)).add(ethers.BigNumber.from(yournftstake[i].Id).mod(1e13)))],
                })

                const reward = await readContract({
                    address: fieldWood,
                    abi: woodFieldABI,
                    functionName: 'calculateRewards',
                    args: [yournftstake[i].Id],
                })

                let level = 0
                let expMax = 0
                let hashRate = 0
                let theClass = 'Novice'
                if (Number((yournftstake[i].Id / 1e13).toFixed(0)) === 1000000) {
                    level = 0
                    expMax = 3
                    hashRate = 1
                } else if (Number((yournftstake[i].Id / 1e13).toFixed(0)) === 1000001) {
                    level = 1
                    expMax = 90
                    hashRate = 10
                } else if (Number((yournftstake[i].Id / 1e13).toFixed(0)) === 1000002) {
                    level = 2
                    expMax = 320
                    hashRate = 20
                } else if (Number((yournftstake[i].Id / 1e13).toFixed(0)) === 1000003) {
                    level = 3
                    expMax = 1080
                    hashRate = 40
                } else if (Number((yournftstake[i].Id / 1e13).toFixed(0)) === 1000004) {
                    level = 4
                    expMax = 2880
                    hashRate = 80
                }

                nfts.push({
                    Id: String(yournftstake[i].Id),
                    Name: nftData.name,
                    Image: nft.image.replace("ipfs://", "https://").concat(".ipfs.nftstorage.link/"),
                    Class: theClass,
                    Level: level,
                    Exp: ethers.utils.formatEther(String(nftData.exp)),
                    ExpMax: expMax,
                    Hashrate: hashRate,
                    RewardWood: ethers.utils.formatEther(String(reward)),
                    RewardCmj: ethers.utils.formatEther(String(reward.div(ethers.BigNumber.from(1e12)))),
                    isStaked: true
                })
            }

            const res2 = address !== null && address !== undefined ? await (await fetch("https://graph.jibchain.net/subgraphs/name/jbc/all", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    query: `{
                        account(id: "` + address + `") {
                            ERC721tokens(where: {contract: "` + CMDS + `"}, first: 1000) {
                                id
                                uri
                            }
                        }
                    }`
                })
            })).json() : null
            const _res2 = res2 !== null && res2.data.account !== null ? res2.data.account.ERC721tokens : []

            for (let i = 0; i <= _res2.length - 1 && address !== null && address !== undefined; i++) {
                const nftipfs = _res2[i].uri
                const response = await fetch(nftipfs.replace("ipfs://", "https://").concat(".ipfs.nftstorage.link/"))
                const nft = await response.json()

                const nftData = await readContract({
                    address: starterCMDS,
                    abi: starterCMDSABI,
                    functionName: 'nftData',
                    args: [String(ethers.BigNumber.from(String(10000000000000000000)).add(ethers.BigNumber.from((_res2[i].id).slice(43)).mod(1e13)))],
                })

                let level = 0
                let expMax = 0
                let hashRate = 0
                let theClass = 'Novice'
                if (Number(((_res2[i].id).slice(43) / 1e13).toFixed(0)) === 1000000) {
                    level = 0
                    expMax = 3
                    hashRate = 1
                } else if (Number(((_res2[i].id).slice(43) / 1e13).toFixed(0)) === 1000001) {
                    level = 1
                    expMax = 90
                    hashRate = 10
                } else if (Number(((_res2[i].id).slice(43) / 1e13).toFixed(0)) === 1000002) {
                    level = 2
                    expMax = 320
                    hashRate = 20
                } else if (Number(((_res2[i].id).slice(43) / 1e13).toFixed(0)) === 1000003) {
                    level = 3
                    expMax = 1080
                    hashRate = 40
                } else if (Number(((_res2[i].id).slice(43) / 1e13).toFixed(0)) === 1000004) {
                    level = 4
                    expMax = 2880
                    hashRate = 80
                }

                nfts.push({
                    Id: String((_res2[i].id).slice(43)),
                    Name: nftData.name,
                    Image: nft.image.replace("ipfs://", "https://").concat(".ipfs.nftstorage.link/"),
                    Class: theClass,
                    Level: level,
                    Exp: ethers.utils.formatEther(String(nftData.exp)),
                    ExpMax: expMax,
                    Hashrate: hashRate,
                    RewardWood: "0.000",
                    RewardCmj: "0.000",
                    isStaked: false
                })
            }
            if (nfts.length === 0) { nfts.push(null) }

            return [nfts]
        }

        const promise = thefetch()

        const getAsync = () =>
            new Promise((resolve) => 
                setTimeout(
                    () => resolve(promise), 1000
                )
            )

        getAsync().then(result => {
            setNft(result[0])
        })

    }, [address, txupdate, aurora721ABI, starterCMDSABI, uplevelCMDSABI, woodFieldABI])

    const mintServant = async () => {
        setisLoading(true)
        try {
            const config = await prepareWriteContract({
                address: starterCMDS,
                abi: starterCMDSABI,
                functionName: 'mintServant',
                args: [1, inputName],
            })
            const tx = await writeContract(config)
            await tx.wait()
            setTxupdate(tx)
        } catch {}
        setisLoading(false)
    }

    const stakeNft = async (_nftid) => {
        setisLoading(true)
        const nftAllow = await readContract({
            address: CMDS,
            abi: aurora721ABI,
            functionName: 'getApproved',
            args: [_nftid],
        })
        if (nftAllow.toUpperCase() !== fieldWood.toUpperCase()) {
            try {
                const config = await prepareWriteContract({
                    address: CMDS,
                    abi: aurora721ABI,
                    functionName: 'approve',
                    args: [fieldWood, _nftid],
                })
                const approvetx = await writeContract(config)
                await approvetx.wait()
            } catch {}
        }
        try {
            const config2 = await prepareWriteContract({
                address: fieldWood,
                abi: woodFieldABI,
                functionName: 'stake',
                args: [_nftid],
            })
            const tx = await writeContract(config2)
            await tx.wait()
            setTxupdate(tx)
        } catch {}
        setisLoading(false)
    }

    const unstakeNft = async (_nftid, _uplevel, _toLv) => {
        setisLoading(true)
        try {
            const config = await prepareWriteContract({
                address: fieldWood,
                abi: woodFieldABI,
                functionName: 'unstake',
                args: [_nftid, true],
            })
            const tx = await writeContract(config)
            await tx.wait()
            setTxupdate(tx)
            setisLoading(false)
            if (_uplevel) {
                uplevelNft(_nftid, _toLv)
            }
        } catch {setisLoading(false)}
    }

    const uplevelNft = async (_nftid, _toLv) => {
        setisLoading(true)
        const nftAllow = await readContract({
            address: CMDS,
            abi: aurora721ABI,
            functionName: 'getApproved',
            args: [_nftid],
        })
        if (nftAllow.toUpperCase() !== uplevelCMDS.toUpperCase()) {
            try {
                const config = await prepareWriteContract({
                    address: CMDS,
                    abi: aurora721ABI,
                    functionName: 'approve',
                    args: [uplevelCMDS, _nftid],
                })
                const approvetx = await writeContract(config)
                await approvetx.wait()
            } catch {}
        }
        try {
            const config = await prepareWriteContract({
                address: uplevelCMDS,
                abi: uplevelCMDSABI,
                functionName: 'uplevelServant',
                args: [_toLv, _nftid],
            })
            const tx = await writeContract(config)
            await tx.wait()
            setTxupdate(tx)
        } catch {}
        setisLoading(false)
    }

    return (
    <>
        <div className="fieldBanner" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", textAlign: "left", overflow: "scroll"}}>
            <div style={{flexDirection: "column", margin: "30px 100px"}}>
                <div className="pixel" style={{fontSize: "95px", width: "fit-content", padding: "0 10px"}}>Ancient Forrest</div>
                <div style={{fontSize: "22.5px", width: "fit-content", marginTop: "15px", padding: "0 10px"}} className="pixel">Stake CommuDAO Servant to earn $WOOD & $CMJ.</div>
            </div>
            <div style={{margin: "30px 100px"}}>
                <img src="../items/wood.png" width="175" alt="$WOOD" />
            </div>
        </div>

        <div style={{margin: "0", padding: "5px 0", alignItems: "flex-start"}} className="collection">
            {nft.length > 0 ?
                <>
                    {nft[0] !== null ?
                        <>
                            {nft.map((item, index) => (
                                <div style={{justifyContent: "space-around", height: "500px"}} className="nftCard" key={index}>
                                    <img src={item.Image} width="175" alt="Can not load metadata." />
                                    <div style={{width: 300, padding: "10px 20px", border: "1px solid #dddade", borderRadius: 12, display: "flex", flexDirection: "row", alignItem: "center", justifyContent: "space-between", textAlign: "left"}} className="pixel">
                                        <div style={{lineHeight: 2, fontSize: "14px", textAlign: "left",}}>
                                            <div style={{color: "black"}}>{item.Name} [Lv. {item.Level}]</div>
                                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                {item.isStaked ?
                                                    <>
                                                        <div style={{background: "rgb(239, 194, 35)", width: 16, height: 16, borderRadius: "50%", marginRight: 7}}></div>
                                                        <div>On Staking</div>
                                                    </> :
                                                    <>
                                                        <div style={{background: "rgb(29, 176, 35)", width: 16, height: 16, borderRadius: "50%", marginRight: 7}}></div>
                                                        <div>Available for stake</div>
                                                    </>
                                                }
                                            </div>
                                            <div>Class : {item.Class}</div>
                                            <div>Hash rate : {item.Hashrate}</div>
                                            <div>EXP : {Number(item.Exp >= 1 ? item.Exp - 1 : 0).toFixed(0)}/{item.ExpMax} ({(((item.Exp >= 1 ? item.Exp - 1 : 0) * 100) / item.ExpMax) >= 100 ? "MAX" : (((item.Exp >= 1 ? item.Exp - 1 : 0) * 100) / item.ExpMax).toFixed(3).concat("%")})</div>
                                        </div>
                                        {item.isStaked ?
                                            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                                                {(((item.Exp - 1) * 100) / item.ExpMax) >= 100 && item.ExpMax !== 2880 ?
                                                    <div style={{lineHeight: 2, height: "fit-content", marginTop: "25px", background: "#67BAA7"}} className="pixel button" onClick={() => {unstakeNft(item.Id, true, item.Level + 1)}}>LEVEL UP</div> :
                                                    <div style={{lineHeight: 2, height: "fit-content", marginTop: "25px", background: "#e9eaeb", color: "#bdc2c4", cursor: "not-allowed"}} className="pixel button">LEVEL UP</div>
                                                }
                                            </div> :
                                            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                                                <div style={{lineHeight: 2, height: "fit-content", textAlign: "center"}} className="pixel button" onClick={() => {stakeNft(item.Id)}}>STAKE</div>
                                                {(((item.Exp - 1) * 100) / item.ExpMax) >= 100 && item.ExpMax !== 2880 ?
                                                    <div style={{lineHeight: 2, height: "fit-content", marginTop: "25px", background: "#67BAA7"}} className="pixel button" onClick={() => {uplevelNft(item.Id, item.Level + 1)}}>LEVEL UP</div> :
                                                    <div style={{lineHeight: 2, height: "fit-content", marginTop: "25px", background: "#e9eaeb", color: "#bdc2c4", cursor: "not-allowed"}} className="pixel button">LEVEL UP</div>
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div style={{width: 300, padding: 20, border: "1px solid #dddade", borderRadius: 12, display: "flex", flexDirection: "row", alignItem: "center", justifyContent: "space-between"}}>
                                        <div style={{lineHeight: 2, fontSize: "12px", textAlign: "left",}} className="bold">
                                            Pending Rewards
                                            <div style={{fontSize: "10px"}} className="emp">EXP: +{Number(item.RewardWood).toFixed(0)}</div>
                                            <div style={{fontSize: "10px"}} className="emp"><img src="../items/wood.png" width="12" alt="$WOOD"/> {item.RewardWood}</div>
                                            <div style={{fontSize: "10px"}} className="emp"><img src="../tokens/cmj.png" width="12" alt="$CMJ"/> {item.RewardCmj}</div>
                                        </div>
                                        {item.RewardWood > 0 ?
                                            <div style={{lineHeight: 2, height: "fit-content", marginTop: "25px"}} className="pixel button" onClick={() => {unstakeNft(item.Id, false, 0)}}>HARVEST</div> :
                                            <div style={{lineHeight: 2, height: "fit-content", marginTop: "25px", background: "#e9eaeb", color: "#bdc2c4", cursor: "not-allowed"}} className="pixel button">HARVEST</div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </> :
                        <>
                            {address !== undefined ?
                                <div className="nftCard" style={{justifyContent: "center", height: "500px"}}>
                                    <img src="https://nftstorage.link/ipfs/bafkreiaqwsxafpj3acgdjmvn4hfodrhj5vdeq4cdiqtaaekpjiuamzcbhq" width="150" alt="Can not load metadata." />
                                    <div style={{margin: "20px 0", fontSize: "18px"}} className="emp pixel">CommuDAO Servant Incubator</div>
                                    <input
                                        style={{width: "90%", padding: "5px 10px", marginBottom: "20px", border: "1px solid #dddade", fontSize: "18px"}}
                                        className="bold"
                                        type="string"
                                        placeholder="Input Servant Name (max 32 chars)"
                                        onChange={(event) => {if (event.target.value.length <= 32) { setInputName(event.target.value)} }}
                                        value={inputName}
                                    ></input>
                                    <div className="pixel button" onClick={mintServant}>MINT SERVANT</div>
                                </div> :
                                <div className="nftCard" style={{justifyContent: "center", height: "500px"}}>
                                    <i style={{fontSize: "150px", marginBottom: "30px"}} className="fa fa-sign-in"></i>
                                    <div className="emp bold">Please connect wallet to view your servant.</div>
                                </div>
                            }
                        </>
                    }
                </> :
                <div className="nftCard" style={{justifyContent: "center", height: "500px"}}>
                    <i style={{fontSize: "150px", marginBottom: "30px"}} className="fa fa-spinner"></i>
                    <div className="emp bold">Loading Servant...</div>
                </div>
            }
        </div>
    </>
    )
}

export default FieldsAncientForrest
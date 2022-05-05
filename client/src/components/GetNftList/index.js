import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Web3 from 'web3';
// import { useWallet } from 'use-wallet';

const GetNftList = () => {
    // const wallet = useWallet();
    const web3 = new Web3(window.ethereum);
    const [wallet, setWallet] = useState('');
    const [tokenURIs, setTokenURIs] = useState(['']);
    useEffect(async () => {
        const account = await web3.eth.getAccounts();
        setWallet(account[0]);
    }, []);
    const getNftList = () => {
        var config = {
            method: 'post',
            url: 'http://localhost:3001/api/contract/getNftList',
            headers: {},
            data: JSON.stringify({
                walletAddress: wallet ?? "0x0"
            })
        };

        axios(config)
            .then(function (response) {
                console.log(response.data.tokenURIs);
                setTokenURIs(response.data.tokenURIs);
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    return (
        <div>
            <button onClick={() => getNftList()}>Get</button>
            <div >
                {tokenURIs.map((uri, index) => {return(
                    <div key={index}>{uri}</div>
                )})}
            </div>
        </div>
    )
}

export default GetNftList;
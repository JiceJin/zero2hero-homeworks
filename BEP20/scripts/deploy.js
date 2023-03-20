const hre = require("hardhat");

async function main(){
    const Jcoin = await hre.ethers.getContractFactory("Jcoin");
    const jcoin = await Jcoin.deploy("Jcoin","JIC");

    const [owner] = await hre.ethers.getSigners();

    await jcoin.deployed();

    console.log(`Jcoin deployed on ${jcoin.address}, owner is ${owner.address}`)

}

main().catch((error)=>{
    console.log(error);
    process.exitCode = 1;
});
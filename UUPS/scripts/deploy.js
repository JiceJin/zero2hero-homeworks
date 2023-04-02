const hre = require("hardhat");

async function main(){
    const [first,second] = await hre.ethers.getSigners();
    
    const Logic1 = await hre.ethers.getContractFactory("logic1");
    const logic1 = await Logic1.deploy();
    await logic1.deployed();

    const Logic2 = await hre.ethers.getContractFactory("logic2");
    const logic2 = await Logic2.deploy();
    await logic2.deployed();

    const Proxy = await hre.ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy(logic1.address);
    await proxy.deployed();

    console.log(`logic1 : ${logic1.address} ; logic2 : ${logic2.address} ; proxy : ${proxy.address}`);
}

main().catch((error)=>{
    console.log(error);
    process.exitCode = 1;
});
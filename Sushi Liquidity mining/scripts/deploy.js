const hre = require("hardhat");

async function main(){
    const Mine = await hre.ethers.getContractFactory("LiquidityMining");
    const mine = await Mine.deploy("0x07f470F7793FeFb0F0602bAfC783023c81F5aE44");

    const [firstAccount,secondAccount] = await hre.ethers.getSigners();

    await mine.deployed();

    console.log(`Deployed on ${mine.address}, ${firstAccount.address} delpoyed it`);
}

main().catch((error)=>{
    console.log(error);
    process.exitCode = 1;
})
const hre = require("hardhat");

async function main(){
    // const Jcoin = await hre.ethers.getContractFactory("Jcoin");
    // const jcoin = await Jcoin.deploy("Jcoin","JIC");

    // await jcoin.deployed();

    // console.log(`Jcoin deployed on ${jcoin.address}, owner is ${await hre.ethers.getSigner()}`)

    const [firstAccount,SecondAccount] = await hre.ethers.getSigners();

    const jcoin = await hre.ethers.getContractAt("Jcoin","0x07f470F7793FeFb0F0602bAfC783023c81F5aE44");

    // let tx =await jcoin.mint(firstAccount.address,100);
    // let re = await tx.wait();

    // let tx = await jcoin.approve(SecondAccount.address, 100);

    let tx = await jcoin.transfer(SecondAccount.address,50);
    let re = await tx.wait();

    console.log(await jcoin.allowance(firstAccount.address,SecondAccount.address),await jcoin.balanceOf(firstAccount.address)
    ,await jcoin.balanceOf(SecondAccount.address));

}

main().catch((error)=>{
    console.log(error);
    process.exitCode = 1;
});
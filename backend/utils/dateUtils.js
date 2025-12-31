export const getISTDate = ()=>{
    const now = new Date();
    return new Date(now.getTime() + 5.5 *60 *60* 1000);
};
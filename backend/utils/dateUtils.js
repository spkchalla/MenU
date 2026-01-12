export const getISTDate = ()=>{
    const now = new Date();
    return new Date(now.getTime() + 5.5 *60 *60* 1000);
};

export const getISTDateString = () =>{
    const date = getISTDate();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // YYYY-MM-DD
}
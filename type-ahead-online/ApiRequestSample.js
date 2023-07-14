export async function make_api_request(info) {
    const { value, length } = info;
    let abortController = new AbortController();
    try {
        const response = await fetch(`https://api.github.com/search/users?per_page=${length}&q=${value}`, {
            signal: abortController.signal,
        });
        abortController = null;
        const data = await response.json();
        return {text : value, result : data.items}
    } catch (e) {
        console.error(e);
        return {text : value, result : []}
    }//try,catch
}//make_api_request
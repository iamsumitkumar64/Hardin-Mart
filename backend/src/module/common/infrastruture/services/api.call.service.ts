const ApiCallService = async (url: string, method: string, headers: any, body?: string) => {
    try {
        const result = await fetch(url, {
            method,
            body,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            }
        });
        const response = await result.json();
        return response;
    }
    catch (err) {
        console.error("Error in ApiService call: ", err);
        return null;
    }
}

export { ApiCallService };
export function getEnvVariable(id) {
    return fetch(
        "Picture/GetEnvVariable" + "?id=" + id
    ).then((resp) => {
        console.log(resp);
        return resp.json();
    })
        .catch((err) => {
            console.log("error");
            console.log(err);
        })
        .then((data) => {
            return data;
        });
}
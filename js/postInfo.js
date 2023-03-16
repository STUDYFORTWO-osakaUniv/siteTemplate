async function postInfo(data) {
    const repoName = location.pathname.replace(/\//g, ""); // "/"除く
    data = {
        ...data,
        repoName: repoName
    }
    let url;
    console.log("post:", data);

    if (data.type === "reserve") { url = "https://script.google.com/macros/s/AKfycbykLnW45WGwUJgJu_XAONK7t6hR9v2C93jEdeT37xbjHCupB-UMcEypdkzVf4AgGqmO/exec" }

    // Promise
    const response = await fetch(url,
        {
            "method": "POST",
            "Content-Type": "application/x-www-form-urlencoded",
            "body": JSON.stringify(data)
        }
    )
    return response.json();
}


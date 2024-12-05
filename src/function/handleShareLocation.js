const handleShareLocation = (location, mapZoom, messageApi) => {
    const [lat, lng] = location;
    const locationNow = window.location;
    let currentPlans = '';

    // check other plan or province plan 
    locationNow.search.split('&').forEach((item) => {
        if (item.startsWith('quyhoach')) {
            currentPlans = item;
        } else if (item.startsWith('plans-by-province')) {
            currentPlans = item;
        }
    });


    const newUrl = `${locationNow.origin}${locationNow.pathname}?vitri=${lat},${lng}&zoom=${mapZoom}&${currentPlans}`;
    if (location) {
        navigator.clipboard
            .writeText(newUrl)
            .then(() => {
                messageApi.open({
                    type: 'success',
                    content: 'Đã sao chép vào bộ nhớ',
                });
            })
            .catch((err) => {
                messageApi.open({
                    type: 'error',
                    content: 'Lỗi khi sao chép vào bộ nhớ',
                });
            });
    } else {
        messageApi.open({
            type: 'info',
            content: 'Bạn vui lòng chọn lại vị trí',
        });
    }
};

export default handleShareLocation;

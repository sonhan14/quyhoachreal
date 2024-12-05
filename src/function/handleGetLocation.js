const handleGetLocation = (location, messageApi) => {
    const [lat, lng] = location;
    if (location) {
        navigator.clipboard
            .writeText(`${lat} ${lng}`)
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

export default handleGetLocation;

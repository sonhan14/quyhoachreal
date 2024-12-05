import { Navigate, useNavigate } from "react-router-dom"
import { Button, Result } from "antd"
const NotFound = () => {
    const navigate = useNavigate();
    return (
        <>  
            <Result
                status='404'
                title='404'
                subTitle='Sorry the page you visted does not exist.'
                extra={
                    <Button type="primary" onClick={()=>{navigate('/')}}>
                        Back home
                    </Button>
                }
            >

            </Result>

        </>
    )
}

export default NotFound;
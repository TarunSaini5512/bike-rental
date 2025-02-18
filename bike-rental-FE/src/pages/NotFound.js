import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found-container">
            <Result
                status="404"
                title="404"
                subTitle="Oops! The page you are looking for does not exist or you do not have permissions to access this page."
                extra={
                    <Link to="/">
                        <Button type="primary" size="large">Back to Home</Button>
                    </Link>
                }
            />
        </div>
    );
};

export default NotFound;

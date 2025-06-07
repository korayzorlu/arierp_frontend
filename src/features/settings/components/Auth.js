import Card from "../../../component/card/Card";
import CardBody from "../../../component/card/CardBody";
import CardHeader from "../../../component/card/CardHeader";
import Input from "../../../component/input/Input";
import Form from "../../../component/form/Form";
import CardFooter from "../../../component/card/CardFooter";
import Button from "../../../component/button/Button";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Auth(props) {
    const {auth, user} = props;

    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");

    return ( 
        <div className="row g-0">
            <div className="col-md-4">
                <Form>
                    <Card>
                        <CardBody>
                            <Input type="text" id="settings-auth-firstName" label={"First Name"} onChange={(e) => setFirstName(e.target.value)}>{firstName}</Input>
                            <Input type="text" id="settings-auth-lastName" label={"Last Name"} onChange={(e) => setLastName(e.target.value)}>{lastName}</Input>
                            <Input type="email" id="settings-auth-email" label={"Email"} onChange={(e) => setEmail(e.target.value)}>{email}</Input>
                            <Link to="/settings/password-reset" className="text-blue-500 fw-bold text-start btn-block">Password Reset</Link>
                        </CardBody>
                        <CardFooter>
                            <Button type="button" color="primary">Save</Button>
                        </CardFooter>
                    </Card>
                </Form>
            </div>
        </div>
        
        
    );
}

export default Auth;
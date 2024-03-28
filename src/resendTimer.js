import { CButton } from '@coreui/react';
import { useState, useEffect } from 'react';

export const ResendTimer = ({ timerFinished, duration }) => {
    const [counter, setCounter] = useState(duration);
    const [min, setMin] = useState("");
    const [sec, setSec] = useState("");
    const [resendDisabled, setResendDisabled] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            var minutes = parseInt(counter / 60, 10);
            var seconds = parseInt(counter % 60, 10);
            var m = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
            var s = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
            setMin(m);
            setSec(s);
            if (counter > 0)
                setCounter((prevCounter) => prevCounter - 1);
            else {
                clearInterval(interval);
                setResendDisabled(false)
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [counter, min, sec,resendDisabled]);
    function startTimer(){
        setCounter(duration);
        setResendDisabled(true);
        timerFinished();
    }
    return (
        <div className="tex-center">
            <h4>If you do not receive the e-mail within {min + ":" + sec}, resend it for activation.</h4>
            <CButton disabled={resendDisabled} color="primary" type='button' className="px-4" onClick={startTimer}>
                Re-Send E-mail
            </CButton>
        </div>
    );
}
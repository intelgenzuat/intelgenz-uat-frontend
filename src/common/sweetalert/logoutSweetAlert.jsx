import React from 'react';
import { useEffect } from 'react';
import SweetAlertModule from 'react-bootstrap-sweetalert';
const SweetAlert = SweetAlertModule.default || SweetAlertModule;


const LogOutSweetAlert = ({ logoutUser, isSwal, setIsSwal }) => {

    useEffect(() => {
        if (isSwal?.show == 2) {
            const timer = setTimeout(() => {
                setIsSwal({ ...isSwal, show: false })
            }, 1500);
            return () => clearTimeout(timer)
        }
    }, [isSwal?.show])

   
    return (
        <React.Fragment>
            {isSwal?.show === true &&
                <SweetAlert
                    // warning
                    showCancel
                    confirmBtnText="Yes"
                    cancelBtnText="Cancel"
                    confirmBtnCssClass=" custom-confirm-button-class"
                    cancelBtnCssClass="custom-cancel-button-class"
                    title={<span className="custom-swal-title">Are you sure want to logout?</span>}
                    onConfirm={() => { logoutUser() }}
                    onCancel={() => { setIsSwal({ ...isSwal, show: false }) }}
                    focusCancelBtn
                >
                </SweetAlert>
            }

        </React.Fragment>
    )
}

export default LogOutSweetAlert
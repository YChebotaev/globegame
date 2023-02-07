import React, { useContext, useEffect } from 'react';
import Modal from './Modal.jsx'

import info1 from '../../info/1.png'
import info2 from '../../info/2.png'
import info3 from '../../info/3.png'
import info4 from '../../info/4.png'

import { FormattedMessage } from "react-intl";

const InfoModal = ({ lastwin, isInfoModalOpen, setIsInfoModalOpen }) => {

    useEffect(() => {
        if (lastwin === '1970-01-01') {
            setIsInfoModalOpen(true);
        }
    }, []);

    return (
        <Modal active={isInfoModalOpen} setActive={setIsInfoModalOpen}>

            <h3 className='text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 text-center'><FormattedMessage id="helpTitle" /></h3>
            <p className='sm:w-full sm:max-w-sm my-2'>
                <FormattedMessage
                    id="help1"
                    values={{
                        b: (chunks) => (
                            <b className={"text-red"}>
                                {chunks}
                            </b>
                        ),
                    }}
                />
            </p>
            <p className='sm:w-full sm:max-w-sm my-2'>
            <FormattedMessage
                    id="help2"
                    values={{
                        b: (chunks) => (
                            <b className={"text-red"}>
                                {chunks}
                            </b>
                        ),
                    }}
                />
            </p>

            <div className='flex flex-col md:flex-row justify-start items-center space-x-3'>

                <div className='flex space-x-6 md:flex-col md:justify-left md:space-x-0 bg-transparent'>
                    <img className="info_img" src={info1} />
                    <p className='text-center my-auto'>France</p>
                    <br className="clearBoth"></br>
                </div>

                <div className='flex space-x-6 md:flex-col md:justify-left md:space-x-0 bg-transparent'>
                    <img className="info_img" src={info2} />
                    <p className='text-center my-auto'>Nepal</p>
                    <br className="clearBoth"></br>
                </div>

                <div className='flex space-x-6 md:flex-col md:justify-left md:space-x-0 bg-transparent'>
                    <img className="info_img" src={info3} />
                    <p className='text-center my-auto'>Mongolia</p>
                    <br className="clearBoth"></br>
                </div>

                <div className='flex space-x-6 md:flex-col md:justify-left md:space-x-0 bg-transparent'>
                    <img className="info_img" src={info4} />
                    <p className='text-center my-auto'>South Korea</p>
                    <br className="clearBoth"></br>
                </div>

            </div>

            <p className='sm:w-full sm:max-w-sm text-center'>
                <FormattedMessage id="help3" />
            </p>

        </Modal>
    );
}

export default InfoModal;
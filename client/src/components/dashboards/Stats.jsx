/*
an iframe will be used to display the stats from the API
*/
import React from "react";
import Navbar from '../Navbar';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const Stats = () => {
    const { user } = useContext(AuthContext);
    return (
        <div>
        <Navbar />

            <iframe title="analyses" width="100%" height="800" src="https://app.powerbi.com/view?r=eyJrIjoiOGY4NjczZDktMjhlMC00NGQ4LTk2OTUtY2M2MTE3Y2ZlZDFjIiwidCI6ImEyZDgzMzZlLWEyOTktNGQ1Mi04NjM2LWI3ZWY4YzExN2ExZCIsImMiOjh9" frameborder="0" allowFullScreen="true"></iframe>

        </div>
    );
    };
export default Stats;


import { useState, useEffect } from 'react';

import styled from 'styled-components';

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;

`;


export default function ChannelDataView({channel}){

    useEffect(() => {
        console.log("channel id changed, fetching data")

    }, [channel])

    return (
        <Container>
        </Container>
    );
};


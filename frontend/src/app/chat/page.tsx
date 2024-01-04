'use client'
import { useState, useEffect } from 'react';

import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Typography from '@mui/material/Typography';

// import axios from 'axios';

// Components
import ChatBox from '@/components/ChatBox';

const baseURL = "http://localhost:3000";

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Chat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content='AI Chat with your todo list' />
      </Head>

      <main>

        <Typography variant="h2" sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4vh"
        }}>
          AI Chat
        </Typography>
        <ChatBox/>

      </main>

    </div>
  )
}
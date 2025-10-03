"use client";

import { useState } from "react";

export default function Dashboard() {
    const [isUser] = useState('student');

    return (
        <>
            {isUser === 'admin' && 
                <div className="">
                    hi
                </div>
            }
            {isUser === 'teacher' && 
                <div className="">
                    hi2
                </div>
            }
            {isUser === 'student' && 
                <div className="">
                    hi3
                </div>
            }
        </>
    )
}
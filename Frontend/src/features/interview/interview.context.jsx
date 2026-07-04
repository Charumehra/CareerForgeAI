import { createContext, useState } from "react";

export const InterviewContext = createContext()

export const InterviewProvider = ({children}) => {
    const [Loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value = {{Loading, setLoading, report , setReport, reports, setReports}}>
            {children}
        </InterviewContext.Provider>
    )
}
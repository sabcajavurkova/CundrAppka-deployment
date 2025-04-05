/* url: /cestovni-balicky/:city */

import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import LoadingCircle from 'components/LoadingCircle'
import 'styles/Packages.css'

function ViewPackagePage() {
    // retrieve city from 
    const { city } = useParams<string>()
    // state in which will be saved the city text
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(true)

    // once the page is loaded useEffect is called and reads out the contents of particular city txt file
    useEffect(() => {
        const path = `/cities_info/${city}.txt`
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Zadané město nemáme ve výběru")
                }
                return response.text()
            })
            .then(data => {
                setText(data)
                setLoading(false)
            })
            .catch(error => console.error("Nastal error při načítání stránky: ", error))
    }, [city]) // re-runs when city is changed

    // while loading, show oading circle
    if (loading) return <LoadingCircle />

    // array w names of the cities which name differ from what is written in url
    const special_city_names: { [key: string]: string } = {
        "Plzen": "Plzeň",
        "Ceske-Budejovice": "České Budějovice",
        "Hradec-Kralove": "Hradec Králové",
        "Zlin": "Zlín"
    }

    // parsing the text into structured sections
    const parseText = (text: string) => {
        const sections = [
            'Web',
            'Historie',
            'Zeměpis',
            'Turistické zajímavosti',
            'Kultura',
            'Restaurace, doprava a ubytování',
            'Výlety v okolí'
        ]

        const sectionData: any = {}
        let currentSection = ''
        let currentContent = ''

        // split by lines and then process each line
        const lines = text.split('\n')
        lines.forEach(line => {
            const matchedSection = sections.find(section => line.startsWith(section))
            if (matchedSection) {
                // if we find a section, save the previous one and start new one
                if (currentSection) {
                    sectionData[currentSection] = currentContent.trim()
                }
                currentSection = matchedSection
                // clean up the section header
                currentContent = line.replace(matchedSection, '').trim()
            } else {
                currentContent += `\n${line}`
            }
        })

        // add the last section to the result
        if (currentSection) {
            sectionData[currentSection] = currentContent.trim()
        }
        return sectionData
    }
    
    // array w setions of the city text
    const sections = parseText(text)

    return (
        <div className="view-package-page">
        <div className="view-package-page-container">
            <h1>{special_city_names[city as keyof typeof special_city_names] || city}</h1>
            <p>Přejít na <a href={`/komunitni-forum/${city}`}>komunitní fórum</a></p>
            <div className="sections-container">
                {Object.keys(sections).map((section, index) => (
                    <div key={index} className="section">
                        <h3>{section}</h3>
                        {/* if section is web make it an <a> tag */}
                        {section === 'Web' ? (
                            <a 
                                href={`https://${sections[section]}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {sections[section]}
                            </a>
                        ) : (
                            <p>{sections[section]}</p>
                        )}
                    </div>
                ))}
            </div>
            <p><a href="/cestovni-balicky">Zpátky</a></p>
        </div>
    </div>
    )
}

export default ViewPackagePage

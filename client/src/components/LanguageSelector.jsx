import {useEffect, useState} from 'react';

const LanguageSelector = ({onSelect}) => {
    const [language,setLanguage] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/judge/languages')
            .then((res) => res.json())
                .then((data) => setLanguage(data))
                .catch((err) => console.error("Failed to fetch languages: ",err));
    }, []);

    return(
        <select onChange={(e) => onSelect(Number(e.target.value))} className="border px-2 py-1 rounded">
      {language.map(lang => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}</select>
    )
}

export default LanguageSelector;
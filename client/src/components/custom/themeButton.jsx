import * as React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Moon, Sun } from 'lucide-react';

export default function ThemeButton({
    className,
}) {
    const [darkMode, setDarkMode] = React.useState(
        localStorage.getItem("darkMode") === "true"
    );

    React.useEffect(() => {
        themeSetter(darkMode);
    }, [darkMode]);

    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark");
    }

    const themeSetter = (isDark) => {   
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    };

    return (
        <Button
            variant="outline"
            className={cn("w-12 h-12",className)}
            onClick={() => setDarkMode((prev) => !prev)}
        >
            {darkMode ? <Sun size={50} color="yellow"/> : <Moon size={50} color="black"/>}
        </Button>
    );   
}
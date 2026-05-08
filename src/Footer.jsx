import React from 'react';
import languageData from './language.json';
import logo from "./assets/logo.png";

function Footer({ lang }) {
    const t = languageData[lang];
    const footerT = t.nav; // Reusing nav links as requested

    return (
        <footer className="w-full bg-fourth text-fifth pt-20 pb-10 px-6 md:px-20 border-t border-white/5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                {/* Four Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-main font-bold tracking-widest text-sm uppercase">{t.nav.Home}</h4>
                        <ul className="flex flex-col gap-4 text-second/60">
                            <li><a href="#" className="hover:text-main transition-colors">{t.nav.Home}</a></li>
                            <li><a href="#" className="hover:text-main transition-colors">{t.nav.About}</a></li>
                            <li><a href="#" className="hover:text-main transition-colors">{t.nav.Services}</a></li>
                            <li><a href="#" className="hover:text-main transition-colors">{t.nav.ContactUs}</a></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-main font-bold tracking-widest text-sm uppercase">{t.nav.Services}</h4>
                        <ul className="flex flex-col gap-4 text-second/60">
                            {t.nav.ServicesList.slice(0, 4).map((service, i) => (
                                <li key={i}><a href="#" className="hover:text-main transition-colors">{service}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-main font-bold tracking-widest text-sm uppercase">{lang === 'en' ? 'Company' : 'الشركة'}</h4>
                        <ul className="flex flex-col gap-4 text-second/60">
                            <li><a href="#" className="hover:text-main transition-colors">{t.nav.About}</a></li>
                            <li><a href="#" className="hover:text-main transition-colors">{lang === 'en' ? 'Careers' : 'الوظائف'}</a></li>
                            <li><a href="#" className="hover:text-main transition-colors">{lang === 'en' ? 'Projects' : 'المشاريع'}</a></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-main font-bold tracking-widest text-sm uppercase">{lang === 'en' ? 'Support' : 'الدعم'}</h4>
                        <ul className="flex flex-col gap-4 text-second/60">
                            <li><a href="#" className="hover:text-main transition-colors">{t.nav.ContactUs}</a></li>
                            <li><a href="#" className="hover:text-main transition-colors">{lang === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}</a></li>
                            <li><a href="#" className="hover:text-main transition-colors">{lang === 'en' ? 'Privacy' : 'الخصوصية'}</a></li>
                        </ul>
                    </div>
                </div>

                {/* Big Footer Title */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <h2 className='text-[2.5rem] md:text-[4rem] xl:text-[5rem] font-bold leading-none select-none opacity-80 hover:opacity-100 transition-opacity duration-700'>
                            {t.hero.title}
                            <span className='font-serif italic bg-gradient-to-r from-[#C9B59C] via-[#D9CFC7] to-[#EFE9E3] bg-clip-text text-transparent'>
                                {t.hero.pioneers}
                            </span>
                        </h2>
                        <p className="text-second/40 text-xs mt-4 tracking-[0.5em] uppercase">
                            Engineering · Trade · Industry
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-2 border border-black/10 shadow-sm">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-second/30 text-[10px] tracking-widest">
                            © {new Date().getFullYear()} BUSINESS PIONEERS. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
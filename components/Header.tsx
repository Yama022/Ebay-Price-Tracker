import React from 'react';
import AuthForm from './AuthForm';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import styles from '../styles/Header.module.scss';
import '../styles/globals.scss';

const Header: React.FC = () => {
    return (
        <header className={styles.container__nav}>
            <Navbar shouldHideOnScroll>
                <NavbarBrand className={styles.container__nav__start}>
                    <Link href="/" className={styles.brandTitle}>
                        TCG Market Value
                    </Link>
                </NavbarBrand>
                <NavbarContent className={styles.container__nav__center}>
                    <NavbarItem className={styles.container__nav__center__link}>
                        <Link href="/items">Items</Link>
                    </NavbarItem>
                    <NavbarItem className={styles.container__nav__center__link}>
                        <Link href="/abonnement">Abonnement</Link>
                    </NavbarItem>
                    <NavbarItem className={styles.container__nav__center__link}>
                        <Link href="/contact">Contact</Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent className={styles.container__nav__end}>
                    <NavbarItem className={styles.container__nav__end__link}>
                        <AuthForm />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </header>
    );
};

export default Header;

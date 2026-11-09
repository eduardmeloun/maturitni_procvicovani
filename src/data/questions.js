
const site = [
    {
      okruh: "Vrstvové modely a základní dělení sítí",
      otazky: [
        "Proč používáme vrstvové modely?",
        "Popište model ISO/OSI.",
        "Popište model TCP/IP.",
        "Porovnejte ISO/OSI a TCP/IP.",
        "Jak dělíme sítě podle rozlehlosti?",
        "Jak dělíme sítě podle topologie?",
        "Jak dělíme sítě podle provozovatele?",
        "Jak dělíme sítě podle postavení uzlů?"
      ]
    },
    {
      okruh: "Strukturovaná kabeláž",
      otazky: [
        "Co je strukturovaná kabeláž?",
        "Jaké jsou zásady plánování kabeláže?",
        "Jaké existují kategorie metalických kabelů?",
        "Jak probíhá krimpování kabelu?",
        "Co je Snellův zákon?",
        "Z čeho se skládá optické vlákno?",
        "Jak dělíme optická vlákna?",
        "Jak se spojují optická vlákna?"
      ]
    },
    {
      okruh: "Ethernet",
      otazky: [
        "Na jakých vrstvách funguje Ethernet?",
        "Popište ethernetový rámec.",
        "Jak funguje CSMA/CD?",
        "Jaké existují standardy Ethernetu?",
        "Jaké jsou rychlosti Ethernetu?",
        "Co je MAC adresa?",
        "Co je ARP?",
        "Jaký je rozdíl mezi hubem a switchem?"
      ]
    },
    {
      okruh: "Bezdrátový přenos",
      otazky: [
        "Jak funguje bezdrátová komunikace?",
        "Co je Wi-Fi?",
        "Co je Bluetooth?",
        "Co je vlnová délka?",
        "Jaké frekvenční pásma používá Wi-Fi?",
        "Co je Fresnelova zóna?",
        "Jak funguje CSMA/CA?",
        "Co znamená RTS/CTS?",
        "Jak zabezpečit Wi-Fi router?"
      ]
    },
    {
      okruh: "Síťová vrstva",
      otazky: [
        "Jaká je funkce síťové vrstvy?",
        "Co je IP paket?",
        "Jak funguje směrování?",
        "Popište IPv4 adresu.",
        "Popište IPv6 adresu.",
        "Jak vypočítat parametry subnetu?",
        "Jaká zařízení pracují na síťové vrstvě?"
      ]
    },
    {
      okruh: "Přechod od IPv4 k IPv6",
      otazky: [
        "Jaké jsou metody koexistence IPv4 a IPv6?",
        "Jaký je rozdíl mezi tunelem a translátorem?",
        "Jaké existují typy tunelů?",
        "Jak funguje 6to4?",
        "Jak funguje 6rd?",
        "Co je Teredo?",
        "Co je ISATAP?"
      ]
    },
    {
      okruh: "Směrovací protokol RIP",
      otazky: [
        "Co je RIP?",
        "Jak funguje RIP?",
        "Jaký je rozdíl mezi RIPv1 a RIPv2?",
        "Jak se aktualizují směrovací tabulky?",
        "Co je nekonečná vzdálenost v RIP?",
        "Co je split horizon?",
        "Co je triggered update?"
      ]
    },
    {
      okruh: "Směrovací protokoly OSPF a BGP",
      otazky: [
        "Co je OSPF?",
        "Jak funguje OSPF?",
        "Jaký algoritmus používá OSPF?",
        "Jaké jsou typy OSPF oblastí?",
        "Jaké jsou typy routerů v OSPF?",
        "Kde se používá BGP?",
        "Jaké jsou vlastnosti BGP?"
      ]
    },
    {
      okruh: "Transportní vrstva",
      otazky: [
        "Jaká je funkce transportní vrstvy?",
        "Co jsou porty?",
        "Co je TCP segment?",
        "Co je UDP datagram?",
        "Jaký je rozdíl mezi TCP a UDP?",
        "Jak probíhá TCP three-way handshake?",
        "Jak se ukončuje TCP spojení?"
      ]
    },
    {
      okruh: "Windows Server",
      otazky: [
        "Jaká je struktura Windows Serveru?",
        "Co je HAL?",
        "Jaká je funkce jádra operačního systému?",
        "Jak probíhá instalace Windows Serveru?",
        "Co je IIS?",
        "Jaké existují edice Windows Serveru?",
        "Co jsou serverové role a funkce?",
        "Jak nastavit diskové kvóty?"
      ]
    },
    {
      okruh: "Autentifikace a důvěra v AD",
      otazky: [
        "Co je autentifikace?",
        "Co je Active Directory?",
        "Jaké objekty obsahuje AD?",
        "Jak funguje autentifikace v doméně?",
        "Jak souvisí AD s Exchange Serverem?",
        "Jak souvisí AD s SQL Serverem?",
        "Co je vztah důvěry mezi počítačem a doménou?"
      ]
    },
    {
      okruh: "Active Directory",
      otazky: [
        "K čemu slouží Active Directory?",
        "Jaké jsou typy objektů v AD?",
        "Co je organizační jednotka?",
        "Jak vytvořit uživatelský účet?",
        "Jak vytvořit zabezpečovací skupinu?",
        "Jak fungují oprávnění ke sdílené složce?",
        "Co jsou zděděná oprávnění?",
        "Jaký je rozdíl mezi místním a cestovním profilem?",
        "Co je síťová domovská složka?"
      ]
    },
    {
      okruh: "DNS na Windows Serveru",
      otazky: [
        "Co je DNS server?",
        "Jak funguje DNS?",
        "Co jsou kořenové DNS servery?",
        "Co je dopředná DNS zóna?",
        "Co je zpětná DNS zóna?",
        "Jaké existují typy DNS záznamů?",
        "Co je autoritativní DNS server?",
        "Co je rekurzivní DNS dotaz?",
        "Co je DNS cache?"
      ]
    },
    {
      okruh: "DHCP na Windows Serveru",
      otazky: [
        "Co je DHCP server?",
        "Jak funguje DHCP?",
        "Co je DHCP DORA?",
        "Co je DHCP scope?",
        "Co je DHCP rezervace?",
        "Co je DHCP výjimka?",
        "Co je doba zapůjčení IP adresy?",
        "Co je množina DHCP oborů?"
      ]
    },
    {
      okruh: "Politiky GPO",
      otazky: [
        "Co je Group Policy Object?",
        "Kde se ukládají GPO?",
        "Co je Default Domain Policy?",
        "Jakými nástroji spravujeme GPO?",
        "Na jaké objekty se mohou GPO vázat?",
        "V jakém pořadí se GPO vyhodnocují?",
        "Jaký je rozdíl mezi Computer a User Configuration?"
      ]
    },
    {
      okruh: "Exchange Server",
      otazky: [
        "Co je Microsoft Exchange Server?",
        "Jak probíhá instalace Exchange Serveru?",
        "Jak vytvořit poštovní schránku?",
        "Jak nastavit oprávnění poštovní schránky?",
        "Co je SMTP?",
        "Co je POP3?",
        "Co je IMAP4?",
        "Co je Outlook Web Access?"
      ]
    },
    {
      okruh: "IIS",
      otazky: [
        "Co je IIS?",
        "Jaké webové služby poskytuje IIS?",
        "Jak nastavit přístup k webovým stránkám?",
        "Jak propojit IIS s Active Directory?",
        "Co je intranet?",
        "Jak funguje HTTP?",
        "Jak funguje HTTPS?",
        "Co je FTP a FTPS?",
        "Co je SSL?"
      ]
    },
    {
      okruh: "Konfigurace síťových rozhraní",
      otazky: [
        "Jak nastavit statickou IP adresu v Linuxu?",
        "Jak nastavit dynamickou IP adresu?",
        "Co je DNS resolver?",
        "Jak funguje statické směrování?",
        "Jak zobrazit směrovací tabulku?",
        "Jaké nástroje používáme pro diagnostiku sítě?",
        "Jak nakonfigurovat Debian jako router?"
      ]
    },
    {
      okruh: "DHCP server v Linuxu",
      otazky: [
        "Jak funguje komunikace DHCP klienta a serveru?",
        "Co je DHCP relay?",
        "Jaké jsou konfigurační soubory DHCP?",
        "Jak nainstalovat DHCP server na Debian?",
        "Jak nakonfigurovat DHCP klienta?",
        "Jak ověřit přidělení IP adresy?"
      ]
    },
    {
      okruh: "DNS server v Linuxu",
      otazky: [
        "Jaká je topologie DNS?",
        "Jaké existují typy DNS serverů?",
        "Co je DNS zóna?",
        "Co obsahuje zónový soubor?",
        "Co je BIND?",
        "Jak nainstalovat BIND na Debian?",
        "Jak nakonfigurovat místní DNS zónu?",
        "Jak ověřit funkčnost DNS serveru?"
      ]
    },
    {
      okruh: "Iptables",
      otazky: [
        "Co je firewall?",
        "Jaké existují typy firewallů?",
        "Co je NAT?",
        "Co je PAT?",
        "Co je Netfilter?",
        "Jaké tabulky a řetězce používá iptables?",
        "Jaká je syntaxe příkazu iptables?",
        "Jak povolit ICMP, TCP a UDP komunikaci?"
      ]
    },
    {
      okruh: "Samba",
      otazky: [
        "Co je Samba?",
        "Co je protokol SMB?",
        "Co je NetBIOS?",
        "Jaké démony používá Samba?",
        "Jaký je hlavní konfigurační soubor Samby?",
        "Jak nainstalovat Sambu na Debian?",
        "Jak sdílet veřejnou složku?",
        "Jak sdílet domovské složky uživatelů?"
      ]
    },
    {
      okruh: "Web server Apache",
      otazky: [
        "Co je Apache?",
        "Jak funguje webový server?",
        "Co je HTTP a HTTPS?",
        "Co je PHP?",
        "Jak nainstalovat Apache2?",
        "Kde se nachází konfigurace Apache?",
        "Jak nastavit TLS?",
        "Jak vytvořit jednoduchou PHP stránku?"
      ]
    },
    {
      okruh: "Mailový server",
      otazky: [
        "Co je MTA?",
        "Co je MDA?",
        "Co je MUA?",
        "Jak funguje SMTP?",
        "Jak funguje POP3?",
        "Jak funguje IMAP?",
        "Co je Exim4?",
        "Co je Dovecot?",
        "Co je Roundcube?",
        "Co je SpamAssassin?"
      ]
    },
    {
      okruh: "Zabezpečení dat a šifrování",
      otazky: [
        "Co je symetrické šifrování?",
        "Co je asymetrické šifrování?",
        "Jaký je rozdíl mezi symetrickou a asymetrickou šifrou?",
        "Co je hash?",
        "Jak funguje elektronický podpis?",
        "Co je S/MIME?",
        "Jak funguje TLS handshake?",
        "Jaký je rozdíl mezi SSL a TLS?"
      ]
    }
  ];
  
  // Převedení okruhů na kartičky pro React
  export const questions = site.flatMap((skupina, i) =>
    skupina.otazky.map((otazka, j) => ({
      id: `site-${i + 1}-${j + 1}`,
      predmet: "Sítě",
      okruh: `${i + 1}. ${skupina.okruh}`,
      tema: skupina.okruh,
      otazka,
      odpoved: "Správná odpověď zatím není doplněna."
    }))
  );
  
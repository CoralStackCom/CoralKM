#!/usr/bin/env python3
"""
Generate a Word (.docx) overview of the CoralKM monorepo and its packages.

Self-contained: builds the OOXML package with the standard library `zipfile`
only — no python-docx / pandoc required.
"""
import os
import zipfile
from xml.sax.saxutils import escape

OUT = os.path.join(os.path.dirname(__file__), "..", "docs", "CoralKM-Wallet-Overview.docx")
NAVY = "1B5678"
SLATE = "13415C"
MUTED = "5B7689"

# --------------------------------------------------------------------------- #
# Low-level WordprocessingML helpers
# --------------------------------------------------------------------------- #

def run(text, *, bold=False, italic=False, color=None, size=None, font="Segoe UI"):
    rpr = ["<w:rFonts w:ascii=\"%s\" w:hAnsi=\"%s\"/>" % (font, font)]
    if bold:
        rpr.append("<w:b/>")
    if italic:
        rpr.append("<w:i/>")
    if color:
        rpr.append('<w:color w:val="%s"/>' % color)
    if size:
        rpr.append('<w:sz w:val="%d"/>' % (size * 2))  # half-points
    rpr_xml = "<w:rPr>%s</w:rPr>" % "".join(rpr)
    return '<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r>' % (rpr_xml, escape(text))


def para(runs="", *, style=None, space_before=0, space_after=120, ind_left=None, bullet=False):
    if isinstance(runs, str):
        runs = [run(runs)] if runs else []
    ppr = []
    if style:
        ppr.append('<w:pStyle w:val="%s"/>' % style)
    if bullet:
        ppr.append('<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>')
    ind = ""
    if ind_left is not None:
        ind = ' w:left="%d"' % ind_left
        ppr.append('<w:ind%s/>' % ind)
    ppr.append('<w:spacing w:before="%d" w:after="%d"/>' % (space_before, space_after))
    ppr_xml = "<w:pPr>%s</w:pPr>" % "".join(ppr)
    return "<w:p>%s%s</w:p>" % (ppr_xml, "".join(runs))


def heading(text, level=1):
    style = "Heading%d" % level
    return para([run(text, bold=True, color=NAVY if level <= 2 else SLATE)], style=style,
                space_before=240 if level == 1 else 160, space_after=80)


def title(text, subtitle=None):
    out = [para([run(text, bold=True, color=NAVY, size=26)], space_after=40)]
    if subtitle:
        out.append(para([run(subtitle, italic=True, color=MUTED, size=12)], space_after=240))
    return "".join(out)


def bullet(text_runs):
    if isinstance(text_runs, str):
        text_runs = [run(text_runs)]
    return para(text_runs, bullet=True, space_after=60)


def table(headers, rows, widths=None):
    n = len(headers)
    widths = widths or [int(9000 / n)] * n
    grid = "".join('<w:gridCol w:w="%d"/>' % w for w in widths)

    def cell(text_runs, w, *, header=False, shade=None):
        if isinstance(text_runs, str):
            text_runs = [run(text_runs, bold=header, color=("FFFFFF" if header else None))]
        shade_xml = '<w:shd w:val="clear" w:fill="%s"/>' % shade if shade else ""
        tcpr = ('<w:tcPr><w:tcW w:w="%d" w:type="dxa"/>%s'
                '<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/>'
                '<w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tcMar></w:tcPr>'
                % (w, shade_xml))
        body = para(text_runs, space_after=0)
        return "<w:tc>%s%s</w:tc>" % (tcpr, body)

    head_row = "<w:tr>%s</w:tr>" % "".join(
        cell(h, widths[i], header=True, shade=NAVY) for i, h in enumerate(headers)
    )
    body_rows = []
    for r, cells in enumerate(rows):
        shade = "EEF3F6" if r % 2 == 0 else None
        body_rows.append(
            "<w:tr>%s</w:tr>" % "".join(
                cell(c, widths[i], shade=shade) for i, c in enumerate(cells)
            )
        )
    borders = ('<w:tblBorders>'
               + "".join('<w:%s w:val="single" w:sz="4" w:color="C9D6DE"/>' % s
                         for s in ("top", "left", "bottom", "right", "insideH", "insideV"))
               + '</w:tblBorders>')
    tblpr = '<w:tblPr><w:tblW w:w="9000" w:type="dxa"/>%s</w:tblPr>' % borders
    return ('<w:tbl>%s<w:tblGrid>%s</w:tblGrid>%s%s</w:tbl>'
            % (tblpr, grid, head_row, "".join(body_rows)) + para("", space_after=120))


# --------------------------------------------------------------------------- #
# Document content
# --------------------------------------------------------------------------- #

body = []
A = body.append

A(title("CoralKM — Wallet & Platform Overview",
        "A user-friendly protocol for decentralized key management · Document generated 2026-06-10"))

A(heading("1. What CoralKM Is", 1))
A(para("CoralKM is a protocol and reference implementation for user-friendly, decentralized "
       "key management. It lets people protect and recover the cryptographic keys behind their "
       "digital wallet without a central custodian holding those keys. The system is built around "
       "Decentralized Identifiers (DIDs) and DIDComm messaging, with social/guardian recovery using "
       "Shamir secret sharing."))
A(para([run("Decentralization model (important). ", bold=True, color=SLATE),
        run("The gateway is not an account server that holds your keys. It is a DIDComm mediator, a "
            "guardian, and a zero-knowledge sync store: it only ever stores opaque encrypted blobs and "
            "routes encrypted messages. The wallet's master key is generated and kept on the user's "
            "device; recovery is achieved through guardian-held Shamir shares released after a "
            "verification challenge.")]))

A(heading("2. Monorepo Layout", 1))
A(para("The project is a Yarn (v4) workspaces monorepo running on Node ≥ 22. Four packages share "
       "one protocol core:"))
A(table(
    ["Package", "Role", "Tech stack"],
    [
        ["@coralkm/core", "Shared protocol library: Veramo DIDComm protocols + the CoralKM v0.1 protocol "
         "(namespace / guardian / recovery), web-did-resolver and DID utilities.",
         "TypeScript, Veramo, DIDComm v2"],
        ["@coralkm/gateway", "The backend. A DIDComm mediator + guardian + zero-knowledge sync store.",
         "Cloudflare Workers (Hono), D1 (SQLite), Durable Objects (WebSocket hub)"],
        ["@coralkm/wallet", "Reference wallet for the web.",
         "React 19, Vite, Tailwind, Radix UI"],
        ["@coralkm/wallet-mobile", "The mobile wallet app (primary focus).",
         "Expo / React Native, expo-router, on-device Veramo agent"],
    ],
    widths=[2300, 4400, 2300],
))

A(heading("3. How the Packages Work Together", 1))
A(para("The wallet apps (web and mobile) each run their own Veramo agent on the user's device and speak "
       "to the gateway only over DIDComm — either HTTP POST /messages or, on mobile, a WebSocket "
       "(/ws) served by a Durable Object hub. All four packages depend on @coralkm/core so that the "
       "wallet, gateway and guardian roles share exactly the same message definitions and protocol logic."))
A(bullet([run("Mediation & routing: ", bold=True), run("the gateway mediates DIDComm messages so a "
        "device with no fixed address can still receive messages (coordinate-mediation-v3, "
        "message-pickup-v3, routing-v2).")]))
A(bullet([run("Namespaces (sync): ", bold=True), run("the wallet backs up an encrypted blob to its "
        "namespace via NAMESPACE_SYNC (PUT/GET). The gateway stores the ciphertext only.")]))
A(bullet([run("Guardians & recovery: ", bold=True), run("guardians hold Shamir shares of the wallet key; "
        "recovery releases shares after a verification challenge, then the device reconstructs the key.")]))

A(heading("4. The Gateway (@coralkm/gateway)", 1))
A(para("A single Cloudflare Worker built with Hono. It instantiates a Veramo agent in the roles "
       "['gateway','guardian'] and persists state in a D1 (SQLite) database. A Durable Object "
       "(WebSocketsHub) keeps real-time DIDComm WebSocket connections alive with hibernation support."))
A(para([run("Key endpoints: ", bold=True, color=SLATE),
        run("GET /.well-known/did.json (gateway DID document), POST /messages (DIDComm over HTTP), "
            "GET /ws (DIDComm over WebSocket).")]))
A(para([run("D1 tables: ", bold=True, color=SLATE),
        run("identifiers, keys, private-keys, services, messages (Veramo); mediation_policies / "
            "mediations; namespace_policies / namespaces; guardian_policies / guardian_shares / "
            "recovery_requests.")]))

A(heading("5. The Mobile Wallet (@coralkm/wallet-mobile)", 1))
A(para("An Expo / React Native application using expo-router for file-based navigation. It runs a "
       "Veramo agent on-device, connects to the gateway over a DIDComm WebSocket, and stores secrets "
       "in the device keychain via expo-secure-store."))

A(heading("5.1 Architecture & State", 2))
A(para("State is held in React Context providers, layered in the root layout: ThemeProvider → "
       "WalletProvider → AuthProvider → UserProvider → PreferencesProvider."))
A(bullet([run("UserContext — single source of truth. ", bold=True),
          run("Holds the account (email, name, avatar), household, and encryption seed. Data captured "
              "during login and setup is written here and persisted to SecureStore, so the profile and "
              "the whole app stay in sync and survive reloads.")]))
A(bullet([run("PreferencesProvider — ", bold=True), run("notification and privacy preferences, "
          "persisted to SecureStore.")]))
A(bullet([run("AuthContext — ", bold=True), run("the biometric app lock (the wallet's second factor); "
          "see Security below.")]))
A(bullet([run("WalletProvider — ", bold=True), run("the on-device Veramo agent, DIDComm channels, "
          "namespace and key material.")]))

A(heading("5.2 Sign-in & Onboarding", 2))
A(para("Sign-in uses an email one-time code (factor 1). A multi-step setup wizard then collects the "
       "user's profile and household and generates an encryption seed. The entropy generator lets the "
       "user draw on a canvas; finger movement is hashed (SHA-256) into a seed, with a live strength "
       "meter and a glowing, app-themed drawing effect. All captured data flows into UserContext."))

A(heading("5.3 Security (Two-Factor App Lock)", 2))
A(para("The wallet's second factor is the device's own biometrics (Face ID / fingerprint), with the "
       "phone passcode as the OS-level fallback — no app PIN is generated or stored. Enabling or "
       "disabling the lock is itself gated by a biometric prompt. The merged Security screen also "
       "provides Login Alerts (a notification on each new sign-in), Login Activity (a real list of "
       "recorded sessions), Download Your Data (a full export via the share sheet), and Delete Account."))

A(heading("5.4 Profile & Settings", 2))
A(para("The Profile page shows real, editable account and household information with an integrated image "
       "handler (avatar and household logo save straight to context). A color-coded Profile menu links "
       "to Security, Notifications, Appearance, Devices, and Help. Inputs across the app share a "
       "validation system (required, email, name, DID, currency, length limits) with inline errors and "
       "character counters."))

A(heading("5.5 Unified Design System", 2))
A(para("All screens share one design system defined in constants/design.ts (a navy/heading palette, "
       "accent colors, radii, soft card shadows, and a tint helper) layered over an animated underwater "
       "Background. A single cross-platform IconSymbol component maps names to Material Icons so icons "
       "render consistently on iOS, Android and web. Reusable building blocks include color-chipped rows, "
       "cards, and a StateView component for loading / empty / error states."))

A(heading("6. Tech Stack Summary", 1))
A(table(
    ["Area", "Technology"],
    [
        ["Language / tooling", "TypeScript, Yarn 4 workspaces, ESLint, Prettier"],
        ["Protocol", "Veramo, DIDComm v2, DIDs (did:peer, did:web), Shamir secret sharing"],
        ["Gateway / backend", "Cloudflare Workers, Hono, D1 (SQLite), Durable Objects"],
        ["Web wallet", "React 19, Vite, Tailwind CSS, Radix UI"],
        ["Mobile wallet", "Expo, React Native, expo-router, Reanimated, expo-secure-store, "
         "expo-local-authentication, expo-crypto"],
        ["Testing", "Vitest (gateway/core), Jest + jest-expo (mobile)"],
    ],
    widths=[2600, 6400],
))

A(heading("7. At a Glance", 1))
A(para([run("CoralKM puts users in control of their own keys: the wallet apps own the secrets, the "
            "gateway never sees plaintext, and recovery is social rather than custodial. The shared "
            "core keeps every role speaking the same protocol, while the mobile wallet adds a polished, "
            "fully-integrated experience — email + biometric sign-in, on-device encryption, a single "
            "source-of-truth state layer, and a consistent design system across every screen.",
            italic=True)]))

# --------------------------------------------------------------------------- #
# Assemble the .docx package
# --------------------------------------------------------------------------- #

document_xml = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    '<w:body>' + "".join(body) +
    '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/>'
    '<w:pgMar w:top="1200" w:right="1200" w:bottom="1200" w:left="1200"/></w:sectPr>'
    '</w:body></w:document>'
)

def pstyle(sid, name, *, size, bold=True, color=NAVY, before=200, after=80, default=False):
    return (
        '<w:style w:type="paragraph" w:styleId="%s"%s>'
        '<w:name w:val="%s"/>'
        '<w:pPr><w:spacing w:before="%d" w:after="%d"/></w:pPr>'
        '<w:rPr><w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/>%s%s'
        '<w:sz w:val="%d"/></w:rPr></w:style>'
        % (sid, ' w:default="1"' if default else "", name, before, after,
           "<w:b/>" if bold else "", '<w:color w:val="%s"/>' % color if color else "",
           size * 2)
    )

styles_xml = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    '<w:docDefaults><w:rPrDefault><w:rPr>'
    '<w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/><w:sz w:val="22"/>'
    '</w:rPr></w:rPrDefault></w:docDefaults>'
    + pstyle("Normal", "Normal", size=11, bold=False, color=None, before=0, after=120, default=True)
    + pstyle("Heading1", "heading 1", size=16, color=NAVY)
    + pstyle("Heading2", "heading 2", size=13, color=NAVY)
    + pstyle("Heading3", "heading 3", size=12, color=SLATE)
    + '</w:styles>'
)

content_types = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
    '</Types>'
)

root_rels = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    '</Relationships>'
)

doc_rels = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    '</Relationships>'
)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", root_rels)
    z.writestr("word/document.xml", document_xml)
    z.writestr("word/styles.xml", styles_xml)
    z.writestr("word/_rels/document.xml.rels", doc_rels)

print("Wrote", os.path.normpath(OUT))

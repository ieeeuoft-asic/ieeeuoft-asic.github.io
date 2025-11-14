---
title: "SimProc: TinyTapeout"
categories:
  - Blog
tags:
  - tiny-tapeout
---
 This week, the ASIC Team submitted **SimProc (Simple Processor)** as a part of the TinyTapeout TTSKY25b shuttle on 10 November 2025. 
 
 TinyTapeout provides a multi-project wafer (MPW) platform where each design occupies a small tile within the final ASIC. 
 
 SimProc, along with an integrated UART-based communication interface, was implemented on a 2x2 tile (approximately 320×200 µm), with an on-chip memory size of 64 bytes (reduced from the original 256 bytes due to size limitations).

 The RTL for SimProc was written in **SystemVerilog** and first validated on a **DE10-Lite FPGA**. The tapeout flow was then handled by the **OpenLane/LibreLane** toolchain, which automated synthesis, floorplanning, and place-and-route. Aside from adjusting configuration parameters to ensure the design fit within a 2×2 tile and met timing, the end-to-end process from RTL to ASIC was almost entirely automated.

 The shuttle is now in fabrication, with chips expected to arrive in **May 2026**.


## SimProc Design Overview

**SimProc** is a compact 8-bit CPU designed entirely from scratch in SystemVerilog.  
Its architecture was originally introduced in my **ECE243 (Computer Organization)** course, where our professor designed and explained the fundamentals of SimProc. Inspired by that, I implemented the full processor in SystemVerilog and adapted it for ASIC fabrication through TinyTapeout.  

The CPU features a minimalist instruction set of **11 atomic operations**, supported by a **64-byte unified memory** for both data and program storage.  

To make the processor more interactive and extensible, I integrated a **UART interface** for serial communication - enabling programming, monitoring, and debugging directly over a terminal connection.  
I’m also developing a **C library API** that provides a higher-level interface for communicating with the chip, making it easier to send instructions, read memory, and control execution from a host computer.







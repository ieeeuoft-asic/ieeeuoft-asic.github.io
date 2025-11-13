---
title: "SimProc: TinyTapeout"
categories:
  - Blog
tags:
  - tiny-tapeout
---


## SimProc (Simple Processor)

**SimProc** is a compact 8-bit CPU designed entirely from scratch in SystemVerilog.  
Its architecture was originally introduced in my **ECE243 (Computer Organization)** course, where our professor designed and explained the fundamentals of SimProc. Inspired by that, I implemented the full processor in SystemVerilog and adapted it for ASIC fabrication through TinyTapeout.  

The CPU features a minimalist instruction set of **11 atomic operations**, supported by a **64-byte unified memory** for both data and program storage.  

To make the processor more interactive and extensible, I integrated a **UART interface** for serial communication — enabling programming, monitoring, and debugging directly over a terminal connection.  
I’m also developing a **C library API** that provides a higher-level interface for communicating with the chip, making it easier to send instructions, read memory, and control execution from a host computer.

## My Experience with the Toolchain







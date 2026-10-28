import Foundation
import Vision
import AppKit

// swift scan.swift <png...>：OCR 找敏感词 + 找二维码 / 条码
let risky = ["微信", "二维码", "扫码", "wechat", "weixin", "公众号", "加群", "vx", "VX"]
for path in CommandLine.arguments.dropFirst() {
    guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("✗ 打不开", path); continue }
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    let text = VNRecognizeTextRequest()
    text.recognitionLevel = .accurate
    text.recognitionLanguages = ["zh-Hans", "en-US"]
    text.usesLanguageCorrection = false
    let codes = VNDetectBarcodesRequest()
    try? handler.perform([text, codes])
    let lines = (text.results ?? []).compactMap { $0.topCandidates(1).first?.string }
    let hits = lines.filter { l in risky.contains { l.lowercased().contains($0.lowercased()) } }
    let mp = lines.filter { $0.contains("小程序") }
    let qr = (codes.results ?? []).map { "\($0.symbology.rawValue):\($0.payloadStringValue ?? "?")" }
    print("\((path as NSString).lastPathComponent)  行数 \(lines.count)  敏感 \(hits)  小程序 \(mp)  码 \(qr)")
}

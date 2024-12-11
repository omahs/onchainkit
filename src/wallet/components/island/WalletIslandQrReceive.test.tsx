import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletContext } from '../WalletProvider';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandQrReceive } from './WalletIslandQrReceive';

vi.mock('../../../useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }) => <>{children}</>,
}));

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
  WalletIslandProvider: ({ children }) => <>{children}</>,
}));

const mockSetCopyText = vi.fn();
const mockSetCopyButtonText = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi
      .fn()
      .mockImplementation((init) => [
        init,
        init === 'Copy' ? mockSetCopyText : mockSetCopyButtonText,
      ]),
  };
});

const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  configurable: true,
});

describe('WalletIslandQrReceive', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    mockUseWalletContext.mockReturnValue({
      isOpen: true,
      isClosing: false,
    });
    mockUseWalletIslandContext.mockReturnValue({
      showQr: false,
      setShowQr: vi.fn(),
    });
    mockSetCopyText.mockClear();
    mockSetCopyButtonText.mockClear();
    mockClipboard.writeText.mockReset();
  });

  it('should render correctly based on isClosing state', () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: true,
    });

    const { rerender } = render(<WalletIslandQrReceive />);
    expect(screen.queryByTestId('ockWalletIslandQrReceive')).toBeNull();

    mockUseWalletContext.mockReturnValue({
      isClosing: false,
    });
    rerender(<WalletIslandQrReceive />);
    expect(screen.getByTestId('ockWalletIslandQrReceive')).toBeInTheDocument();
  });

  it('should focus backButtonRef when showQr is true', () => {
    mockUseWalletIslandContext.mockReturnValue({
      showQr: true,
      setShowQr: vi.fn(),
    });

    render(<WalletIslandQrReceive />);
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toHaveFocus();
  });

  it('should close when the back button is clicked', () => {
    const setShowQrMock = vi.fn();
    mockUseWalletIslandContext.mockReturnValue({
      showQr: true,
      setShowQr: setShowQrMock,
    });

    render(<WalletIslandQrReceive />);
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(setShowQrMock).toHaveBeenCalledWith(false);
  });

  it('should copy address when the copy icon is clicked', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
    });

    mockUseWalletIslandContext.mockReturnValue({
      showQr: true,
    });

    render(<WalletIslandQrReceive />);

    const copyIcon = screen.getByRole('button', { name: /copy icon/i });

    await act(async () => {
      fireEvent.click(copyIcon);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(mockSetCopyText).toHaveBeenCalledWith('Copied');

    const tooltip = screen.getByRole('button', { name: /copy tooltip/i });
    expect(tooltip).toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    expect(mockSetCopyText).toHaveBeenCalledWith('Copy');

    expect(mockSetCopyButtonText.mock.calls.length).toBe(1); // setCopyButtonText is only called at initial render

    vi.useRealTimers();
  });

  it('should copy address when the copy tooltip is clicked', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
    });

    mockUseWalletIslandContext.mockReturnValue({
      showQr: true,
    });

    render(<WalletIslandQrReceive />);

    const copyTooltip = screen.getByRole('button', { name: /copy tooltip/i });

    await act(async () => {
      fireEvent.click(copyTooltip);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(mockSetCopyText).toHaveBeenCalledWith('Copied');

    const tooltip = screen.getByRole('button', { name: /copy tooltip/i });
    expect(tooltip).toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    expect(mockSetCopyText).toHaveBeenCalledWith('Copy');

    expect(mockSetCopyButtonText.mock.calls.length).toBe(1); // setCopyButtonText is only called at initial render

    vi.useRealTimers();
  });

  it('should copy address when the copy button is clicked', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
    });

    mockUseWalletIslandContext.mockReturnValue({
      showQr: true,
    });

    render(<WalletIslandQrReceive />);

    const copyButton = screen.getByRole('button', { name: /copy button/i });

    await act(async () => {
      fireEvent.click(copyButton);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(mockSetCopyButtonText).toHaveBeenCalledWith('Address copied');

    vi.advanceTimersByTime(2000);
    expect(mockSetCopyButtonText).toHaveBeenCalledWith('Copy address');

    expect(mockSetCopyText.mock.calls.length).toBe(1); // setCopyText is only called at initial render

    vi.useRealTimers();
  });

  it('should handle clipboard errors gracefully', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
    });

    render(<WalletIslandQrReceive />);

    mockSetCopyText.mockClear();
    const copyIcon = screen.getByRole('button', { name: /copy icon/i });
    await act(async () => {
      fireEvent.click(copyIcon);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockSetCopyText).toHaveBeenCalledWith('Failed to copy');

    vi.advanceTimersByTime(2000);

    mockSetCopyButtonText.mockClear();
    const copyButton = screen.getByRole('button', { name: /copy button/i });
    await act(async () => {
      fireEvent.click(copyButton);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockSetCopyButtonText).toHaveBeenCalledWith(
      'Failed to copy address',
    );

    vi.useRealTimers();
  });

  it('should copy empty string when address is empty', () => {
    mockUseWalletContext.mockReturnValue({
      address: undefined,
    });

    render(<WalletIslandQrReceive />);

    const copyIcon = screen.getByRole('button', { name: /copy icon/i });
    fireEvent.click(copyIcon);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('');
  });
});

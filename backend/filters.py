from scipy.signal import butter, filtfilt

def butterworth_filter(data, cutoff=2, fs=100, order=3):

    nyquist = 0.5 * fs
    normal_cutoff = cutoff / nyquist

    b, a = butter(order, normal_cutoff, btype='low')

    return filtfilt(b, a, data)
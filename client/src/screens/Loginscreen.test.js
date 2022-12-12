import { render, screen, fireEvent } from "@testing-library/react";
import Loginscreen from './Loginscreen';

test("email input should be rendered", () => {
    render(
        <Loginscreen />
    )

    const usernameInputEl = screen.getByPlaceholderText(/email/i);
    expect(usernameInputEl).toBeInTheDocument();
});

test("password input should be rendered", () => {
    render(
        <Loginscreen />
    )
    const passwordInputEl = screen.getByPlaceholderText(/password/i);
    expect(passwordInputEl).toBeInTheDocument();
});

test("button should be rendered", () => {
    render(
        <Loginscreen />
    )
    const buttonEl = screen.getByRole("button");
    expect(buttonEl).toBeInTheDocument();
});

test("email input should be empty", () => {
    render(
        <Loginscreen />
    )

    const usernameInputEl = screen.getByPlaceholderText(/email/i);
    expect(usernameInputEl.value).toBe("");
});

test("password input should be empty", () => {
    render(
        <Loginscreen />
    )
    const passwordInputEl = screen.getByPlaceholderText(/password/i);
    expect(passwordInputEl.value).toBe("");
});

test("button should be disabled", () => {
    render(
        <Loginscreen />
    )
    const buttonEl = screen.getByRole("button");
    expect(buttonEl).toBeEnabled();
});

test("loading should not be rendered", () => {
    render(
        <Loginscreen />
    )
    const buttonEl = screen.getByRole("button");
    expect(buttonEl).not.toHaveTextContent(/please wait/i);
});


test("email input should change", () => {
    render(
        <Loginscreen />
    )

    const usernameInputEl = screen.getByPlaceholderText(/email/i);
    const testValue = "test";

    fireEvent.change(usernameInputEl, { target: { value: testValue } });
    expect(usernameInputEl.value).toBe(testValue);
});

test("password input should change", () => {
    render(
        <Loginscreen />
    )

    const passwordInputEl = screen.getByPlaceholderText(/password/i);
    const testValue = "test";

    fireEvent.change(passwordInputEl, { target: { value: testValue } });
    expect(passwordInputEl.value).toBe(testValue);
});

test("button should not be disabled when inputs exist", () => {
    render(
        <Loginscreen />
    )

    const buttonEl = screen.getByRole("button");
    const usernameInputEl = screen.getByPlaceholderText(/email/i);
    const passwordInputEl = screen.getByPlaceholderText(/password/i);

    const testValue = "test";

    fireEvent.change(usernameInputEl, { target: { value: testValue } });
    fireEvent.change(passwordInputEl, { target: { value: testValue } });

    expect(buttonEl).not.toBeDisabled();
});